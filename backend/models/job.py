from datetime import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class JobStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"

class WorkMode(str, enum.Enum):
    ON_SITE = "On-site"
    HYBRID = "Hybrid"
    REMOTE = "Remote"

class EmploymentType(str, enum.Enum):
    FULL_TIME = "Full Time"
    PART_TIME = "Part Time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"

class RequirementType(str, enum.Enum):
    EDUCATION = "EDUCATION"
    EXPERIENCE = "EXPERIENCE"
    TECH_SKILL = "TECH_SKILL"
    SOFT_SKILL = "SOFT_SKILL"
    PROJECT = "PROJECT"
    CERTIFICATION = "CERTIFICATION"
    KNOWLEDGE = "KNOWLEDGE"
    CUSTOM = "CUSTOM"

class SkillLevel(str, enum.Enum):
    BASIC = "Basic"
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("owner_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    department = Column(String(150), nullable=False)
    category = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(Text, nullable=True)
    employment_type = Column(String(50), default="Full Time", nullable=False)
    work_mode = Column(String(50), default="Hybrid", nullable=False)
    location = Column(String(150), default="Bangalore, India", nullable=False)
    salary_range = Column(String(100), default="Competitive / Best in Industry")
    openings = Column(Integer, default=1)
    deadline = Column(String(100), nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)
    min_score_threshold = Column(Float, default=70.0)
    category_thresholds = Column(JSON, default=dict)  # e.g. {"Technical Skills": 60, "Problem Solving": 60}
    current_criteria_version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("OwnerProfile", back_populates="jobs")
    requirements = relationship("JobRequirement", back_populates="job", cascade="all, delete-orphan")
    criteria = relationship("JobCriteria", back_populates="job", cascade="all, delete-orphan")
    criteria_versions = relationship("CriteriaVersion", back_populates="job", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")

class JobRequirement(Base):
    __tablename__ = "job_requirements"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # EDUCATION, TECH_SKILL, etc.
    name = Column(String(255), nullable=False)
    level = Column(String(50), nullable=True)  # Intermediate, Advanced, etc.
    is_required = Column(Boolean, default=True)  # True = REQUIRED, False = PREFERRED
    weight = Column(Float, default=10.0)  # Percentage weight
    min_score = Column(Float, default=0.0)
    is_knockout = Column(Boolean, default=False)
    details = Column(JSON, default=dict)

    job = relationship("Job", back_populates="requirements")

class JobCriteria(Base):
    __tablename__ = "job_criteria"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    category_name = Column(String(100), nullable=False)
    weight_percentage = Column(Float, nullable=False)
    sub_weights = Column(JSON, default=dict)

    job = relationship("Job", back_populates="criteria")

class CriteriaTemplate(Base):
    __tablename__ = "criteria_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    role_type = Column(String(100), nullable=False)
    criteria_json = Column(JSON, nullable=False)
    default_thresholds = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class CriteriaVersion(Base):
    __tablename__ = "criteria_versions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    changed_by = Column(String(150), nullable=False)
    criteria_snapshot = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="criteria_versions")
