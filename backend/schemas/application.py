from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class RequirementEvidenceItem(BaseModel):
    name: str
    type: str
    is_required: bool
    status: str  # "Met", "Not Met", "Partially Met", "Unclear / Evidence Not Found"
    evidence: str
    impact: str  # "High", "Medium", "Low"

class CandidateScoreResponse(BaseModel):
    overall_score: float
    criteria_breakdown: Dict[str, float]
    requirement_evidence: List[RequirementEvidenceItem]
    knockout_met: bool
    human_review_recommended: bool
    recruiter_override: bool
    override_reason: Optional[str] = None
    evaluated_at: datetime

    class Config:
        from_attributes = True

class RecruiterNoteCreate(BaseModel):
    note_text: str
    is_private: bool = True

class RecruiterNoteResponse(BaseModel):
    id: int
    application_id: int
    author_name: str
    note_text: str
    is_private: bool
    created_at: datetime

    class Config:
        from_attributes = True

class F2FScheduleCreate(BaseModel):
    round_type: str = "FACE_TO_FACE"  # FACE_TO_FACE, VIRTUAL
    date_str: str
    time_str: str
    location_or_link: str
    interviewer_name: str = "Talent Acquisition Lead"
    duration_minutes: int = 45
    instructions: Optional[str] = None

class F2FScheduleResponse(BaseModel):
    id: int
    application_id: int
    round_type: str
    date_str: str
    time_str: str
    location_or_link: str
    interviewer_name: str
    duration_minutes: int
    instructions: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: str
    criteria_version: int
    applied_at: datetime
    updated_at: datetime
    job_title: Optional[str] = None
    job_department: Optional[str] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    candidate_phone: Optional[str] = None
    candidate_headline: Optional[str] = None
    candidate_experience: Optional[float] = None
    scores: Optional[CandidateScoreResponse] = None
    notes_count: Optional[int] = 0
    interview_status: Optional[str] = None
    f2f_scheduled: Optional[bool] = False

    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: str
    note: Optional[str] = None
    recruiter_override: Optional[bool] = False
    override_reason: Optional[str] = None
