from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class InterviewQuestionSchema(BaseModel):
    id: int
    question_text: str
    question_type: str
    order_num: int
    target_skill: Optional[str]
    context_hint: Optional[str]

    class Config:
        from_attributes = True

class InterviewStartResponse(BaseModel):
    interview_id: int
    token: str
    status: str
    job_title: str
    candidate_name: str
    duration_minutes: int
    questions: List[InterviewQuestionSchema]

class AnswerSubmit(BaseModel):
    question_id: int
    answer_text: str
    response_time_seconds: int = 30
    confidence_score: Optional[float] = 0.85

class IntegrityEventCreate(BaseModel):
    event_type: str  # TAB_SWITCH, FOCUS_LOST, FULLSCREEN_EXIT, etc.
    severity: str = "LOW"  # LOW, MEDIUM, HIGH
    evidence: str

class IntegrityEventResponse(BaseModel):
    id: int
    interview_id: int
    event_type: str
    severity: str
    evidence: str
    review_status: str
    timestamp: datetime

    class Config:
        from_attributes = True

class InterviewResultResponse(BaseModel):
    interview_id: int
    technical_score: float
    problem_solving_score: float
    role_knowledge_score: float
    project_understanding_score: float
    communication_score: float
    overall_performance: float
    strengths: List[str]
    weaknesses: List[str]
    skill_gaps: List[str]
    improvement_suggestions: List[str]
    interview_summary: str
    evaluated_at: datetime
    integrity_events_count: int = 0
    risk_level: str = "Low Risk"

    class Config:
        from_attributes = True
