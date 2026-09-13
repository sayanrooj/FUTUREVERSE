from datetime import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class ApplicationStatus(str, enum.Enum):
    APPLIED = "Applied"
    CV_SCREENED = "CV Screening"
    RECRUITER_REVIEW = "Recruiter Review"
    SHORTLISTED = "Shortlisted"
    AI_INTERVIEW_INVITED = "AI Interview Invited"
    INTERVIEW_COMPLETED = "Interview Completed"
    F2F_SCHEDULED = "Face-to-Face Scheduled"
    OFFERED = "Offer Extended"
    REJECTED = "Not Selected"

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(100), default="application/pdf")
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="resumes")
    parsed_data = relationship("ParsedResumeData", back_populates="resume", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="resume")

class ParsedResumeData(Base):
    __tablename__ = "parsed_resume_data"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False)
    extracted_name = Column(String(255), nullable=True)
    extracted_email = Column(String(255), nullable=True)
    extracted_phone = Column(String(50), nullable=True)
    education_history = Column(JSON, default=list)
    degree = Column(String(150), nullable=True)
    technical_skills = Column(JSON, default=list)
    soft_skills = Column(JSON, default=list)
    experience_years = Column(Float, default=0.0)
    experience_details = Column(JSON, default=list)
    projects = Column(JSON, default=list)
    certifications = Column(JSON, default=list)
    languages = Column(JSON, default=list)
    confirmed_by_candidate = Column(Boolean, default=True)
    parsed_at = Column(DateTime, default=datetime.utcnow)

    resume = relationship("Resume", back_populates="parsed_data")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default=ApplicationStatus.APPLIED.value, nullable=False)
    final_decision = Column(String(50), nullable=True)  # SELECTED, NOT_SELECTED, ON_HOLD, or None
    final_decision_at = Column(DateTime, nullable=True)
    final_decision_by = Column(String(150), nullable=True)
    final_decision_notes = Column(Text, nullable=True)
    criteria_version = Column(Integer, default=1)
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    candidate = relationship("CandidateProfile", back_populates="applications")
    resume = relationship("Resume", back_populates="applications")
    scores = relationship("CandidateScore", back_populates="application", uselist=False, cascade="all, delete-orphan")
    interview = relationship("Interview", back_populates="application", uselist=False, cascade="all, delete-orphan")
    recruiter_notes = relationship("RecruiterNote", back_populates="application", cascade="all, delete-orphan")
    f2f_schedule = relationship("InterviewSchedule", back_populates="application", uselist=False, cascade="all, delete-orphan")

class CandidateScore(Base):
    __tablename__ = "candidate_scores"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    overall_score = Column(Float, default=0.0)  # 0 to 100
    criteria_breakdown = Column(JSON, default=dict)  # {category: score}
    requirement_evidence = Column(JSON, default=list)  # [{name, type, status: Met/Not Met/Partially Met/Unclear, evidence, impact}]
    knockout_met = Column(Boolean, default=True)
    human_review_recommended = Column(Boolean, default=False)
    recruiter_override = Column(Boolean, default=False)
    override_reason = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="scores")

class RecruiterNote(Base):
    __tablename__ = "recruiter_notes"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    author_name = Column(String(150), default="Recruiter")
    note_text = Column(Text, nullable=False)
    is_private = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="recruiter_notes")
