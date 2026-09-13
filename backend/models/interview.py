from datetime import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class InterviewStatus(str, enum.Enum):
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    EXPIRED = "Expired"
    TERMINATED = "Terminated"

class IntegrityEventType(str, enum.Enum):
    TAB_SWITCH = "Tab Switch"
    FOCUS_LOST = "Focus Lost"
    FULLSCREEN_EXIT = "Fullscreen Exit"
    MULTIPLE_PEOPLE = "Multiple People Detected"
    SUSPICIOUS_AUDIO = "Background Voice Detected"
    OFF_SCREEN = "Candidate Left Camera Frame"
    COPY_PASTE = "Copy/Paste Signal"
    TECHNICAL_DISCONNECT = "Network Reconnect"

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    token = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(50), default=InterviewStatus.SCHEDULED.value, nullable=False)
    scheduled_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=25)
    current_question_index = Column(Integer, default=0)

    application = relationship("Application", back_populates="interview")
    questions = relationship("InterviewQuestion", back_populates="interview", cascade="all, delete-orphan")
    result = relationship("InterviewResult", back_populates="interview", uselist=False, cascade="all, delete-orphan")
    integrity_events = relationship("IntegrityEvent", back_populates="interview", cascade="all, delete-orphan")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="TECHNICAL")  # TECHNICAL, PROJECT, SCENARIO, BEHAVIORAL
    order_num = Column(Integer, default=1)
    target_skill = Column(String(100), nullable=True)
    context_hint = Column(Text, nullable=True)

    interview = relationship("Interview", back_populates="questions")
    answers = relationship("InterviewAnswer", back_populates="question", cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=False)
    answer_text = Column(Text, nullable=False)
    response_time_seconds = Column(Integer, default=30)
    confidence_score = Column(Float, default=0.85)
    follow_up_generated = Column(Boolean, default=False)
    follow_up_question = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)

    question = relationship("InterviewQuestion", back_populates="answers")

class InterviewResult(Base):
    __tablename__ = "interview_results"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), unique=True, nullable=False)
    technical_score = Column(Float, default=0.0)
    problem_solving_score = Column(Float, default=0.0)
    role_knowledge_score = Column(Float, default=0.0)
    project_understanding_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    overall_performance = Column(Float, default=0.0)
    strengths = Column(JSON, default=list)
    weaknesses = Column(JSON, default=list)
    skill_gaps = Column(JSON, default=list)
    improvement_suggestions = Column(JSON, default=list)
    interview_summary = Column(Text, nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

    interview = relationship("Interview", back_populates="result")

class IntegrityEvent(Base):
    __tablename__ = "integrity_events"

    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(100), nullable=False)
    severity = Column(String(50), default="LOW")  # LOW, MEDIUM, HIGH
    evidence = Column(Text, nullable=False)
    review_status = Column(String(50), default="PENDING_REVIEW")  # PENDING_REVIEW, DISMISSED, ACTION_TAKEN
    timestamp = Column(DateTime, default=datetime.utcnow)

    interview = relationship("Interview", back_populates="integrity_events")

class InterviewSchedule(Base):
    __tablename__ = "interview_schedules"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), unique=True, nullable=False)
    round_type = Column(String(50), default="FACE_TO_FACE")  # FACE_TO_FACE, VIRTUAL
    date_str = Column(String(100), nullable=False)
    time_str = Column(String(100), nullable=False)
    location_or_link = Column(String(255), nullable=False)
    interviewer_name = Column(String(150), default="Talent Acquisition Lead")
    duration_minutes = Column(Integer, default=45)
    instructions = Column(Text, nullable=True)
    status = Column(String(50), default="SCHEDULED")
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="f2f_schedule")
