from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Dict, Any, List
from datetime import datetime

from backend.database import get_db
from backend.models.interview import (
    Interview, InterviewQuestion, InterviewAnswer, InterviewResult,
    IntegrityEvent, InterviewStatus
)
from backend.models.application import Application, ApplicationStatus
from backend.models.user import CandidateProfile, User
from backend.models.job import Job
from backend.schemas.interview import (
    InterviewStartResponse, AnswerSubmit, IntegrityEventCreate,
    IntegrityEventResponse, InterviewResultResponse
)
from backend.services.interview_service import InterviewService
from backend.services.integrity_service import IntegrityService
from backend.services.notification_service import NotificationService
from backend.services.audit_service import AuditService

router = APIRouter(prefix="/api/interview", tags=["AI Interview Session"])

@router.get("/session/{token}")
async def get_interview_session(token: str, db: AsyncSession = Depends(get_db)):
    """Retrieves proctored interview session, questions, and current candidate progress"""
    result = await db.execute(
        select(Interview)
        .filter(Interview.token == token)
        .options(
            selectinload(Interview.questions).selectinload(InterviewQuestion.answers),
            selectinload(Interview.application).selectinload(Application.job),
            selectinload(Interview.application).selectinload(Application.candidate).selectinload(CandidateProfile.user),
            selectinload(Interview.result)
        )
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found or invalid access token.")

    app = interview.application
    job = app.job if app else None
    cand_user = app.candidate.user if app and app.candidate else None

    # Auto start if scheduled
    if interview.status == InterviewStatus.SCHEDULED.value:
        interview.status = InterviewStatus.IN_PROGRESS.value
        interview.started_at = datetime.utcnow()
        await db.commit()

    questions_data = []
    for q in sorted(interview.questions, key=lambda x: x.order_num):
        ans = q.answers[0] if q.answers else None
        questions_data.append({
            "id": q.id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "order_num": q.order_num,
            "target_skill": q.target_skill,
            "context_hint": q.context_hint,
            "is_answered": ans is not None,
            "saved_answer": ans.answer_text if ans else "",
            "follow_up": ans.follow_up_question if ans else None
        })

    return {
        "interview_id": interview.id,
        "token": interview.token,
        "status": interview.status,
        "job_title": job.title if job else "Engineering Role",
        "job_department": job.department if job else "",
        "candidate_name": cand_user.full_name if cand_user else "Candidate",
        "duration_minutes": interview.duration_minutes,
        "questions": questions_data,
        "is_completed": interview.status == InterviewStatus.COMPLETED.value
    }

@router.post("/session/{token}/answer")
async def submit_answer(token: str, req: AnswerSubmit, db: AsyncSession = Depends(get_db)):
    """Submits answer for a question and adaptively generates smart follow-ups"""
    result = await db.execute(
        select(Interview).filter(Interview.token == token).options(selectinload(Interview.questions))
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    res_q = await db.execute(
        select(InterviewQuestion).filter(InterviewQuestion.id == req.question_id, InterviewQuestion.interview_id == interview.id)
    )
    question = res_q.scalars().first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found in this interview.")

    # Check if answer exists
    res_ans = await db.execute(select(InterviewAnswer).filter(InterviewAnswer.question_id == question.id))
    answer = res_ans.scalars().first()

    follow_up = InterviewService.generate_follow_up(question.question_text, req.answer_text)

    if answer:
        answer.answer_text = req.answer_text
        answer.response_time_seconds = req.response_time_seconds
        answer.confidence_score = req.confidence_score or 0.85
        answer.follow_up_question = follow_up
    else:
        answer = InterviewAnswer(
            question_id=question.id,
            answer_text=req.answer_text,
            response_time_seconds=req.response_time_seconds,
            confidence_score=req.confidence_score or 0.85,
            follow_up_generated=True,
            follow_up_question=follow_up
        )
        db.add(answer)

    await db.commit()

    return {
        "message": "Answer recorded successfully.",
        "follow_up_question": follow_up
    }

@router.post("/session/{token}/integrity-event")
async def record_integrity_event(token: str, req: IntegrityEventCreate, db: AsyncSession = Depends(get_db)):
    """
    Logs proctoring signal (tab switch, blur, fullscreen exit) and returns responsible
    warning guidelines. Prevents premature auto-rejection while preserving security audit.
    """
    result = await db.execute(
        select(Interview).filter(Interview.token == token).options(selectinload(Interview.integrity_events))
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    existing_count = len(interview.integrity_events)
    assessment = IntegrityService.assess_event(
        event_type=req.event_type,
        existing_events_count=existing_count,
        evidence=req.evidence
    )

    ev = IntegrityEvent(
        interview_id=interview.id,
        event_type=req.event_type,
        severity=assessment["severity"],
        evidence=req.evidence,
        review_status="FLAGGED" if assessment["severity"] in ("MEDIUM", "HIGH") else "LOGGED"
    )
    db.add(ev)
    await db.commit()

    return {
        "action": assessment["action"],
        "severity": assessment["severity"],
        "warning_message": assessment["warning_message"],
        "is_technical": assessment.get("is_technical", False)
    }

@router.post("/session/{token}/complete")
async def complete_interview(token: str, db: AsyncSession = Depends(get_db)):
    """
    Finalizes interview session, computes multidimensional AI evaluation,
    updates pipeline status, and triggers notifications.
    """
    result = await db.execute(
        select(Interview)
        .filter(Interview.token == token)
        .options(
            selectinload(Interview.questions).selectinload(InterviewQuestion.answers),
            selectinload(Interview.application).selectinload(Application.job),
            selectinload(Interview.application).selectinload(Application.candidate).selectinload(CandidateProfile.user),
            selectinload(Interview.integrity_events),
            selectinload(Interview.result)
        )
    )
    interview = result.scalars().first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    app = interview.application
    job = app.job if app else None
    cand_user = app.candidate.user if app and app.candidate else None

    # Collect answers
    answers_list = []
    for q in interview.questions:
        if q.answers:
            answers_list.append({"question_text": q.question_text, "answer_text": q.answers[0].answer_text})

    # Evaluate interview
    eval_result = InterviewService.evaluate_interview(
        answers=answers_list,
        job_title=job.title if job else "Technical Role"
    )

    # Save or update InterviewResult
    if interview.result:
        res_record = interview.result
        res_record.technical_score = eval_result["technical_score"]
        res_record.problem_solving_score = eval_result["problem_solving_score"]
        res_record.role_knowledge_score = eval_result["role_knowledge_score"]
        res_record.project_understanding_score = eval_result["project_understanding_score"]
        res_record.communication_score = eval_result["communication_score"]
        res_record.overall_performance = eval_result["overall_performance"]
        res_record.strengths = eval_result["strengths"]
        res_record.weaknesses = eval_result["weaknesses"]
        res_record.skill_gaps = eval_result["skill_gaps"]
        res_record.improvement_suggestions = eval_result["improvement_suggestions"]
        res_record.interview_summary = eval_result["interview_summary"]
    else:
        res_record = InterviewResult(
            interview_id=interview.id,
            technical_score=eval_result["technical_score"],
            problem_solving_score=eval_result["problem_solving_score"],
            role_knowledge_score=eval_result["role_knowledge_score"],
            project_understanding_score=eval_result["project_understanding_score"],
            communication_score=eval_result["communication_score"],
            overall_performance=eval_result["overall_performance"],
            strengths=eval_result["strengths"],
            weaknesses=eval_result["weaknesses"],
            skill_gaps=eval_result["skill_gaps"],
            improvement_suggestions=eval_result["improvement_suggestions"],
            interview_summary=eval_result["interview_summary"]
        )
        db.add(res_record)

    interview.status = InterviewStatus.COMPLETED.value
    interview.completed_at = datetime.utcnow()
    app.status = ApplicationStatus.INTERVIEW_COMPLETED.value

    # Notify candidate
    if cand_user:
        await NotificationService.create_notification(
            db=db,
            user_id=cand_user.id,
            title=f"AI Interview Completed: {job.title}",
            message=f"Your AI interview has been evaluated. Overall performance score: {eval_result['overall_performance']}/100.",
            notif_type="SUCCESS",
            link="/candidate/applications"
        )

        await NotificationService.send_email(
            to_email=cand_user.email,
            recipient_name=cand_user.full_name,
            subject=f"AI Interview Completed: {job.title} — FUTUREVERSE",
            body_html=f"<p>Thank you for completing your AI interview for <strong>{job.title}</strong>. Your evaluation has been compiled with an overall performance score of <strong>{eval_result['overall_performance']}%</strong>. Our hiring team will review your session.</p>"
        )

    await db.commit()

    return {
        "message": "Interview submitted and evaluated successfully.",
        "interview_id": interview.id,
        "evaluation": eval_result
    }

@router.get("/session/{token}/result")
async def get_interview_result(token: str, db: AsyncSession = Depends(get_db)):
    """Returns candidate's constructive feedback and performance summary"""
    result = await db.execute(
        select(Interview)
        .filter(Interview.token == token)
        .options(selectinload(Interview.result), selectinload(Interview.integrity_events))
    )
    interview = result.scalars().first()
    if not interview or not interview.result:
        raise HTTPException(status_code=404, detail="Evaluation results not yet ready or interview incomplete.")

    res = interview.result
    return {
        "interview_id": interview.id,
        "technical_score": res.technical_score,
        "problem_solving_score": res.problem_solving_score,
        "role_knowledge_score": res.role_knowledge_score,
        "project_understanding_score": res.project_understanding_score,
        "communication_score": res.communication_score,
        "overall_performance": res.overall_performance,
        "strengths": res.strengths,
        "weaknesses": res.weaknesses,
        "skill_gaps": res.skill_gaps,
        "improvement_suggestions": res.improvement_suggestions,
        "summary": res.interview_summary,
        "integrity_events_count": len(interview.integrity_events)
    }
