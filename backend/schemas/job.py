from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class RequirementSchema(BaseModel):
    id: Optional[int] = None
    type: str  # EDUCATION, EXPERIENCE, TECH_SKILL, SOFT_SKILL, PROJECT, CERTIFICATION, KNOWLEDGE, CUSTOM
    name: str
    level: Optional[str] = "Intermediate"
    is_required: bool = True  # True = REQUIRED, False = PREFERRED
    weight: float = 10.0
    min_score: float = 0.0
    is_knockout: bool = False
    details: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

class CriteriaCategorySchema(BaseModel):
    id: Optional[int] = None
    category_name: str
    weight_percentage: float
    sub_weights: Optional[Dict[str, float]] = {}

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str = Field(..., min_length=3)
    department: str
    category: str
    description: str
    responsibilities: Optional[str] = None
    employment_type: str = "Full Time"
    work_mode: str = "Hybrid"
    location: str = "Bangalore, India"
    salary_range: str = "Competitive"
    openings: int = 1
    deadline: Optional[str] = None
    status: str = "ACTIVE"
    min_score_threshold: float = 70.0
    category_thresholds: Dict[str, float] = {}
    requirements: List[RequirementSchema] = []
    criteria: List[CriteriaCategorySchema] = []

    @field_validator("criteria")
    @classmethod
    def validate_total_weight(cls, v, values):
        if not v:
            return v
        total = sum(c.weight_percentage for c in v)
        if abs(total - 100.0) > 0.1:
            raise ValueError(f"Total criteria weight must equal exactly 100%. Current total is {total:.1f}%")
        return v

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    employment_type: Optional[str] = None
    work_mode: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    openings: Optional[int] = None
    deadline: Optional[str] = None
    status: Optional[str] = None
    min_score_threshold: Optional[float] = None
    category_thresholds: Optional[Dict[str, float]] = None
    requirements: Optional[List[RequirementSchema]] = None
    criteria: Optional[List[CriteriaCategorySchema]] = None

class JobResponse(BaseModel):
    id: int
    owner_id: int
    title: str
    department: str
    category: str
    description: str
    responsibilities: Optional[str]
    employment_type: str
    work_mode: str
    location: str
    salary_range: str
    openings: int
    deadline: Optional[str]
    status: str
    min_score_threshold: float
    category_thresholds: Dict[str, Any]
    current_criteria_version: int
    created_at: datetime
    requirements_count: Optional[int] = 0
    applications_count: Optional[int] = 0

    class Config:
        from_attributes = True

class JobDetailResponse(JobResponse):
    requirements: List[RequirementSchema] = []
    criteria: List[CriteriaCategorySchema] = []

class CriteriaTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    role_type: str
    criteria_json: List[Dict[str, Any]]
    default_thresholds: Dict[str, float] = {}

class CriteriaTemplateResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    role_type: str
    criteria_json: List[Dict[str, Any]]
    default_thresholds: Dict[str, float]
    created_at: datetime

    class Config:
        from_attributes = True
