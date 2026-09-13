from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from pathlib import Path
import shutil
import uuid
from datetime import datetime

from backend.config import settings
from backend.database import get_db
from backend.models.user import User, CandidateProfile, UserRole
from backend.models.job import Job, JobRequirement, JobCriteria
from backend.models.application import Resume, ParsedResumeData, Application, CandidateScore, ApplicationStatus
from backend.models.interview import Interview, InterviewStatus, InterviewQuestion
from backend.models.cms import Notification, SupportTicket, SupportMessage, TicketStatus
from backend.schemas.application import ApplicationResponse
from backend.services.auth_service import get_current_user, require_roles
from backend.services.resume_parser_service import ResumeParserService
from backend.services.candidate_matching_service import CandidateMatchingService
from backend.services.skill_gap_service import SkillGapService
from backend.services.interview_service import InterviewService
from backend.services.notification_service import NotificationService
from backend.services.audit_service import AuditService
from backend.services.application_status_service import ApplicationStatusService

router = APIRouter(prefix="/api/candidate", tags=["Candidate Portal"])

@router.get("/profile")
async def get_candidate_profile(
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .options(selectinload(CandidateProfile.resumes).selectinload(Resume.parsed_data))
    )
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)

    latest_resume = profile.resumes[-1] if profile.resumes else None
    parsed_info = latest_resume.parsed_data if latest_resume else None

    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": profile.phone,
        "headline": profile.headline,
        "bio": profile.bio,
        "location": profile.location,
        "education_level": profile.education_level,
        "field_of_study": profile.field_of_study,
        "experience_years": profile.experience_years,
        "skills": profile.skills or [],
        "projects": profile.projects or [],
        "certifications": profile.certifications or [],
        "has_resume": latest_resume is not None,
        "resume_id": latest_resume.id if latest_resume else None,
        "resume_filename": latest_resume.filename if latest_resume else None,
        "parsed_data": {
            "degree": parsed_info.degree if parsed_info else "",
            "technical_skills": parsed_info.technical_skills if parsed_info else [],
            "soft_skills": parsed_info.soft_skills if parsed_info else [],
            "experience_years": parsed_info.experience_years if parsed_info else 0.0,
            "projects": parsed_info.projects if parsed_info else [],
            "certifications": parsed_info.certifications if parsed_info else [],
            "confirmed": parsed_info.confirmed_by_candidate if parsed_info else False
        } if parsed_info else None
    }

@router.put("/profile")
async def update_candidate_profile(
    data: Dict[str, Any],
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CandidateProfile).filter(CandidateProfile.user_id == current_user.id))
    profile = result.scalars().first()
    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)

    if "phone" in data: profile.phone = data["phone"]
    if "headline" in data: profile.headline = data["headline"]
    if "bio" in data: profile.bio = data["bio"]
    if "location" in data: profile.location = data["location"]
    if "education_level" in data: profile.education_level = data["education_level"]
    if "field_of_study" in data: profile.field_of_study = data["field_of_study"]
    if "experience_years" in data: profile.experience_years = float(data["experience_years"])
    if "skills" in data: profile.skills = data["skills"]
    if "projects" in data: profile.projects = data["projects"]
    if "certifications" in data: profile.certifications = data["certifications"]

    if "full_name" in data and data["full_name"]:
        current_user.full_name = data["full_name"]

    await db.commit()
    return {"message": "Candidate profile updated successfully."}

@router.post("/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    Accepts PDF / DOCX / TXT.
    Validates file type & size, securely stores private file, and executes AI CV parser.
    """
    allowed_exts = [".pdf", ".docx", ".txt"]
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{file_ext}'. Please upload a PDF, DOCX, or TXT file."
        )

    # Read content
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds maximum allowed size of 15MB.")

    # Unique private filename
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    dest_path = settings.UPLOAD_DIR / saved_filename
    with open(dest_path, "wb") as f:
        f.write(content)

    # Extract text (fallback to decoded text or simulated extraction)
    extracted_text = ""
    try:
        extracted_text = content.decode("utf-8", errors="ignore")
    except Exception:
        extracted_text = f"Candidate CV: {file.filename} with skills in Python, Machine Learning, SQL, APIs."

    # Parse CV with ResumeParserService
    parsed_result = ResumeParserService.parse_text(extracted_text, file.filename)

    # Get profile
    res_prof = await db.execute(select(CandidateProfile).filter(CandidateProfile.user_id == current_user.id))
    profile = res_prof.scalars().first()

    # Save Resume record
    resume = Resume(
        candidate_id=profile.id,
        filename=file.filename,
        file_path=str(dest_path),
        file_size=len(content),
        mime_type=file.content_type or "application/pdf"
    )
    db.add(resume)
    await db.flush()

    # Save Parsed Data
    parsed_record = ParsedResumeData(
        resume_id=resume.id,
        extracted_name=parsed_result["extracted_name"],
        extracted_email=parsed_result["extracted_email"],
        extracted_phone=parsed_result["extracted_phone"],
        education_history=parsed_result["education_history"],
        degree=parsed_result["degree"],
        technical_skills=parsed_result["technical_skills"],
        soft_skills=parsed_result["soft_skills"],
        experience_years=parsed_result["experience_years"],
        experience_details=parsed_result["experience_details"],
        projects=parsed_result["projects"],
        certifications=parsed_result["certifications"],
        languages=parsed_result["languages"],
        confirmed_by_candidate=True
    )
    db.add(parsed_record)

    # Sync profile with extracted skills and experience
    profile.skills = list(dict.fromkeys((profile.skills or []) + parsed_result["technical_skills"]))
    if not profile.education_level:
        profile.education_level = parsed_result["degree"]
    if profile.experience_years == 0:
        profile.experience_years = parsed_result["experience_years"]

    await db.commit()

    await AuditService.log_event(
        db=db,
        action="CV_UPLOADED",
        user=current_user,
        target_type="Resume",
        target_id=str(resume.id),
        details={"filename": file.filename}
    )

    return {
        "message": "CV uploaded and parsed successfully.",
        "resume_id": resume.id,
        "filename": file.filename,
        "parsed_data": parsed_result
    }

@router.put("/resume/confirm")
async def confirm_parsed_resume(
    data: Dict[str, Any],
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Allows candidate to review and fine-tune AI-extracted information"""
    res_prof = await db.execute(
        select(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .options(selectinload(CandidateProfile.resumes).selectinload(Resume.parsed_data))
    )
    profile = res_prof.scalars().first()
    if not profile or not profile.resumes:
        raise HTTPException(status_code=404, detail="No uploaded resume found to confirm.")

    latest_resume = profile.resumes[-1]
    parsed_record = latest_resume.parsed_data
    if parsed_record:
        if "degree" in data: parsed_record.degree = data["degree"]
        if "technical_skills" in data: parsed_record.technical_skills = data["technical_skills"]
        if "soft_skills" in data: parsed_record.soft_skills = data["soft_skills"]
        if "experience_years" in data: parsed_record.experience_years = float(data["experience_years"])
        if "projects" in data: parsed_record.projects = data["projects"]
        if "certifications" in data: parsed_record.certifications = data["certifications"]
        parsed_record.confirmed_by_candidate = True

    # Update profile skills
    if "technical_skills" in data:
        profile.skills = data["technical_skills"]
    if "experience_years" in data:
        profile.experience_years = float(data["experience_years"])

    await db.commit()
    return {"message": "Extracted CV credentials confirmed successfully."}

@router.post("/apply/{job_id}")
async def apply_for_job(
    job_id: int,
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """
    Submits application, matches candidate against job criteria, generates explainable
    evidence badges (Met 🟢, Not Met 🔴, Partially Met 🟡, Unclear ⚪), and creates evaluation record.
    """
    # 1. Fetch Candidate Profile & Resume
    res_prof = await db.execute(
        select(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .options(selectinload(CandidateProfile.resumes).selectinload(Resume.parsed_data))
    )
    profile = res_prof.scalars().first()
    if not profile:
        raise HTTPException(status_code=400, detail="Candidate profile not found. Please complete profile.")

    # 2. Prevent Duplicate Application
    existing_app = await db.execute(
        select(Application).filter(Application.job_id == job_id, Application.candidate_id == profile.id)
    )
    if existing_app.scalars().first():
        raise HTTPException(status_code=400, detail="You have already submitted an application for this position.")

    # 3. Fetch Job, Requirements, Criteria
    res_job = await db.execute(
        select(Job)
        .filter(Job.id == job_id)
        .options(selectinload(Job.requirements), selectinload(Job.criteria))
    )
    job = res_job.scalars().first()
    if not job or job.status != "ACTIVE":
        raise HTTPException(status_code=404, detail="Job position is no longer accepting applications.")

    # 4. Extract CV data
    latest_resume = profile.resumes[-1] if profile.resumes else None
    parsed_dict = {}
    if latest_resume and latest_resume.parsed_data:
        p = latest_resume.parsed_data
        parsed_dict = {
            "degree": p.degree,
            "technical_skills": p.technical_skills,
            "soft_skills": p.soft_skills,
            "experience_years": p.experience_years,
            "projects": p.projects,
            "certifications": p.certifications
        }

    # 5. Run CandidateMatchingService
    profile_dict = {
        "skills": profile.skills,
        "education_level": profile.education_level,
        "experience_years": profile.experience_years,
        "projects": profile.projects
    }
    match_result = CandidateMatchingService.match_candidate_to_job(
        parsed_cv=parsed_dict,
        candidate_profile=profile_dict,
        job=job,
        requirements=job.requirements,
        criteria_list=job.criteria
    )

    # 6. Create Application record
    new_app = Application(
        job_id=job.id,
        candidate_id=profile.id,
        resume_id=latest_resume.id if latest_resume else None,
        status=ApplicationStatus.CV_SCREENED.value,
        criteria_version=job.current_criteria_version
    )
    db.add(new_app)
    await db.flush()

    # 7. Create CandidateScore record
    score_record = CandidateScore(
        application_id=new_app.id,
        overall_score=match_result["overall_score"],
        criteria_breakdown=match_result["criteria_breakdown"],
        requirement_evidence=match_result["requirement_evidence"],
        knockout_met=match_result["knockout_met"],
        human_review_recommended=match_result["human_review_recommended"]
    )
    db.add(score_record)

    # 8. Dispatch notification & transactional email
    await NotificationService.create_notification(
        db=db,
        user_id=current_user.id,
        title=f"Application Received: {job.title}",
        message=f"Your application for {job.title} was received and analyzed by our AI matching engine. Initial match score: {match_result['overall_score']:.1f}/100.",
        notif_type="APPLICATION",
        link=f"/candidate/applications"
    )

    await NotificationService.send_email(
        to_email=current_user.email,
        recipient_name=current_user.full_name,
        subject=f"Application Submitted: {job.title} at FUTUREVERSE",
        body_html=f"<p>Thank you for applying to <strong>{job.title}</strong> ({job.department}). Your CV has been successfully matched against our role criteria with an AI match score of <strong>{match_result['overall_score']:.1f}%</strong>.</p><p>Our talent team will review your application shortly.</p>"
    )

    await AuditService.log_event(
        db=db,
        action="APPLICATION_SUBMITTED",
        user=current_user,
        target_type="Application",
        target_id=str(new_app.id),
        details={"job_id": job.id, "score": match_result["overall_score"]}
    )

    await db.commit()

    return {
        "message": "Application submitted successfully.",
        "application_id": new_app.id,
        "match_score": match_result["overall_score"],
        "status": new_app.status
    }

@router.get("/applications")
async def get_my_applications(
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Returns candidate's submitted applications with full status pipeline history"""
    res_prof = await db.execute(select(CandidateProfile).filter(CandidateProfile.user_id == current_user.id))
    profile = res_prof.scalars().first()
    if not profile:
        return []

    result = await db.execute(
        select(Application)
        .filter(Application.candidate_id == profile.id)
        .options(
            selectinload(Application.job),
            selectinload(Application.scores),
            selectinload(Application.interview).selectinload(Interview.result),
            selectinload(Application.f2f_schedule)
        )
        .order_by(Application.applied_at.desc())
    )
    apps = result.scalars().all()

    resp = []
    for a in apps:
        status_summary = ApplicationStatusService.resolve_status(a)
        resp.append({
            "id": a.id,
            "job_id": a.job_id,
            "job_title": a.job.title if a.job else "Position",
            "job_department": a.job.department if a.job else "",
            "work_mode": a.job.work_mode if a.job else "Hybrid",
            "status": a.status,
            "final_decision": a.final_decision,
            "final_decision_at": a.final_decision_at.isoformat() if a.final_decision_at else None,
            "final_decision_by": a.final_decision_by,
            "final_decision_notes": a.final_decision_notes,
            "status_summary": status_summary,
            "applied_at": a.applied_at,
            "updated_at": a.updated_at,
            "scores": {
                "overall_score": a.scores.overall_score if a.scores else 0.0,
                "criteria_breakdown": a.scores.criteria_breakdown if a.scores else {},
                "requirement_evidence": a.scores.requirement_evidence if a.scores else [],
                "knockout_met": a.scores.knockout_met if a.scores else True
            } if a.scores else None,
            "interview": {
                "id": a.interview.id,
                "token": a.interview.token,
                "status": a.interview.status,
                "scheduled_at": a.interview.scheduled_at
            } if a.interview else None,
            "f2f_schedule": {
                "round_type": a.f2f_schedule.round_type,
                "date_str": a.f2f_schedule.date_str,
                "time_str": a.f2f_schedule.time_str,
                "location_or_link": a.f2f_schedule.location_or_link,
                "interviewer_name": a.f2f_schedule.interviewer_name,
                "instructions": a.f2f_schedule.instructions
            } if a.f2f_schedule else None
        })
    return resp

@router.get("/skill-gap/{job_id}")
async def get_skill_gap(
    job_id: int,
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Calculates Strong, Developing, and Missing skills for candidate vs job"""
    res_prof = await db.execute(
        select(CandidateProfile)
        .filter(CandidateProfile.user_id == current_user.id)
        .options(selectinload(CandidateProfile.resumes).selectinload(Resume.parsed_data))
    )
    profile = res_prof.scalars().first()
    res_job = await db.execute(
        select(Job).filter(Job.id == job_id).options(selectinload(Job.requirements))
    )
    job = res_job.scalars().first()
    if not job or not profile:
        raise HTTPException(status_code=404, detail="Job or Candidate Profile not found.")

    latest_resume = profile.resumes[-1] if profile.resumes else None
    parsed_dict = {}
    if latest_resume and latest_resume.parsed_data:
        parsed_dict = {
            "technical_skills": latest_resume.parsed_data.technical_skills,
            "projects": latest_resume.parsed_data.projects
        }

    return SkillGapService.analyze_skill_gaps(
        job_requirements=job.requirements,
        candidate_skills=profile.skills or [],
        parsed_data=parsed_dict
    )

@router.get("/notifications")
async def get_candidate_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .limit(25)
    )
    return result.scalars().all()

@router.put("/notifications/{notif_id}/read")
async def mark_notification_read(
    notif_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Notification).filter(Notification.id == notif_id, Notification.user_id == current_user.id)
    )
    notif = result.scalars().first()
    if notif:
        notif.is_read = True
        await db.commit()
    return {"status": "success"}

# --- TWO-WAY SUPPORT SYSTEM ENDPOINTS ---

@router.post("/support/tickets")
async def create_support_ticket(
    payload: Dict[str, Any],
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Candidate creates a new support ticket"""
    subject = payload.get("subject", "").strip()
    category = payload.get("category", "General Inquiry").strip()
    message = payload.get("message", "").strip()
    priority = payload.get("priority", "MEDIUM").upper()

    if not subject or not message:
        raise HTTPException(status_code=400, detail="Subject and message are required.")

    ticket = SupportTicket(
        user_id=current_user.id,
        subject=subject,
        category=category,
        message=message,
        status=TicketStatus.OPEN.value,
        priority=priority,
        replies=[]
    )
    db.add(ticket)
    await db.flush()

    # Create initial message
    first_msg = SupportMessage(
        ticket_id=ticket.id,
        sender_id=current_user.id,
        sender_role="CANDIDATE",
        sender_name=current_user.full_name,
        message=message
    )
    db.add(first_msg)

    # In-App Notification & Confirmation Email
    await NotificationService.create_notification(
        db=db,
        user_id=current_user.id,
        title=f"Support Ticket #{ticket.id} Created",
        message=f"Your inquiry '{subject}' has been submitted to Support Desk.",
        notif_type="INFO",
        link="/candidate/support"
    )

    await NotificationService.send_support_ticket_received(
        db=db,
        to_email=current_user.email,
        recipient_name=current_user.full_name,
        ticket_id=ticket.id,
        ticket_subject=subject
    )

    await AuditService.log_event(
        db=db,
        action="SUPPORT_TICKET_CREATED",
        user=current_user,
        target_type="SupportTicket",
        target_id=str(ticket.id),
        details={"subject": subject, "priority": priority}
    )

    await db.commit()
    await db.refresh(ticket)

    return {
        "id": ticket.id,
        "subject": ticket.subject,
        "category": ticket.category,
        "status": ticket.status,
        "priority": ticket.priority,
        "created_at": ticket.created_at
    }

@router.get("/support/tickets")
async def list_my_support_tickets(
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Returns candidate's support tickets with message previews"""
    result = await db.execute(
        select(SupportTicket)
        .filter(SupportTicket.user_id == current_user.id)
        .options(selectinload(SupportTicket.messages))
        .order_by(SupportTicket.updated_at.desc())
    )
    tickets = result.scalars().all()

    resp = []
    for t in tickets:
        msgs = t.messages or []
        last_msg = msgs[-1] if msgs else None
        resp.append({
            "id": t.id,
            "subject": t.subject,
            "category": t.category,
            "status": t.status,
            "priority": t.priority,
            "created_at": t.created_at,
            "updated_at": t.updated_at,
            "message_count": len(msgs),
            "last_message_preview": last_msg.message[:120] if last_msg else t.message[:120],
            "last_sender_role": last_msg.sender_role if last_msg else "CANDIDATE",
            "last_sender_name": last_msg.sender_name if last_msg else current_user.full_name
        })
    return resp

@router.get("/support/tickets/{ticket_id}")
async def get_support_ticket_thread(
    ticket_id: int,
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves full conversation history for a candidate's ticket"""
    result = await db.execute(
        select(SupportTicket)
        .filter(SupportTicket.id == ticket_id, SupportTicket.user_id == current_user.id)
        .options(selectinload(SupportTicket.messages))
    )
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found.")

    # Mark unread messages as read
    for m in ticket.messages:
        if m.sender_role in ("ADMIN", "SUPER_ADMIN", "OWNER") and not m.read_at:
            m.read_at = datetime.utcnow()
    await db.commit()

    return {
        "id": ticket.id,
        "subject": ticket.subject,
        "category": ticket.category,
        "status": ticket.status,
        "priority": ticket.priority,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "messages": [
            {
                "id": m.id,
                "sender_id": m.sender_id,
                "sender_role": m.sender_role,
                "sender_name": m.sender_name,
                "message": m.message,
                "created_at": m.created_at,
                "is_candidate": m.sender_role == "CANDIDATE"
            }
            for m in ticket.messages
        ]
    }

@router.post("/support/tickets/{ticket_id}/messages")
async def reply_to_support_ticket(
    ticket_id: int,
    payload: Dict[str, Any],
    current_user: User = Depends(require_roles(UserRole.CANDIDATE)),
    db: AsyncSession = Depends(get_db)
):
    """Candidate sends a follow-up reply in the support conversation"""
    message_text = payload.get("message", "").strip()
    if not message_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    result = await db.execute(
        select(SupportTicket).filter(SupportTicket.id == ticket_id, SupportTicket.user_id == current_user.id)
    )
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found.")

    new_msg = SupportMessage(
        ticket_id=ticket.id,
        sender_id=current_user.id,
        sender_role="CANDIDATE",
        sender_name=current_user.full_name,
        message=message_text
    )
    db.add(new_msg)

    ticket.updated_at = datetime.utcnow()
    # If ticket was waiting for candidate or resolved, reopen it
    if ticket.status in (TicketStatus.WAITING_CANDIDATE.value, TicketStatus.RESOLVED.value):
        ticket.status = TicketStatus.IN_PROGRESS.value

    # Append to legacy replies column as well for backwards compatibility
    replies = list(ticket.replies or [])
    replies.append({
        "author": current_user.full_name,
        "role": "Candidate",
        "message": message_text,
        "timestamp": datetime.utcnow().isoformat()
    })
    ticket.replies = replies

    await AuditService.log_event(
        db=db,
        action="SUPPORT_MESSAGE_SENT",
        user=current_user,
        target_type="SupportTicket",
        target_id=str(ticket.id),
        details={"sender": current_user.full_name}
    )

    await db.commit()
    await db.refresh(new_msg)

    return {
        "id": new_msg.id,
        "sender_id": new_msg.sender_id,
        "sender_role": new_msg.sender_role,
        "sender_name": new_msg.sender_name,
        "message": new_msg.message,
        "created_at": new_msg.created_at,
        "is_candidate": True
    }
