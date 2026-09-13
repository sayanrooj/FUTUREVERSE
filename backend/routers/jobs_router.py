from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime
from backend.database import get_db
from backend.models.user import User, UserRole, OwnerProfile
from backend.models.job import Job, JobRequirement, JobCriteria, CriteriaTemplate, CriteriaVersion
from backend.models.application import Application
from backend.schemas.job import (
    JobCreate, JobUpdate, JobResponse, JobDetailResponse,
    CriteriaTemplateCreate, CriteriaTemplateResponse
)
from backend.services.auth_service import get_current_user, require_roles
from backend.services.audit_service import AuditService

router = APIRouter(prefix="/api/jobs", tags=["Jobs & Requirements"])

@router.get("", response_model=List[JobResponse])
async def list_jobs(
    search: Optional[str] = None,
    department: Optional[str] = None,
    work_mode: Optional[str] = None,
    employment_type: Optional[str] = None,
    location: Optional[str] = None,
    status_filter: str = "ACTIVE",
    db: AsyncSession = Depends(get_db)
):
    """Public and authenticated job listings with search and filter capabilities"""
    query = select(Job).filter(Job.status == status_filter).order_by(Job.created_at.desc())

    if search:
        query = query.filter(
            Job.title.ilike(f"%{search}%") |
            Job.description.ilike(f"%{search}%") |
            Job.department.ilike(f"%{search}%")
        )
    if department:
        query = query.filter(Job.department.ilike(f"%{department}%"))
    if work_mode:
        query = query.filter(Job.work_mode == work_mode)
    if employment_type:
        query = query.filter(Job.employment_type == employment_type)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    result = await db.execute(query.options(selectinload(Job.requirements), selectinload(Job.applications)))
    jobs = result.scalars().all()

    resp = []
    for j in jobs:
        data = JobResponse.from_orm(j)
        data.requirements_count = len(j.requirements)
        data.applications_count = len(j.applications)
        resp.append(data)
    return resp

@router.get("/templates/list", response_model=List[CriteriaTemplateResponse])
async def get_criteria_templates(db: AsyncSession = Depends(get_db)):
    """Fetch criteria templates for quick job setup"""
    result = await db.execute(select(CriteriaTemplate).order_by(CriteriaTemplate.name))
    return result.scalars().all()

@router.post("/templates", response_model=CriteriaTemplateResponse)
async def create_criteria_template(
    req: CriteriaTemplateCreate,
    current_user: User = Depends(require_roles(UserRole.OWNER, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    template = CriteriaTemplate(
        name=req.name,
        description=req.description,
        role_type=req.role_type,
        criteria_json=req.criteria_json,
        default_thresholds=req.default_thresholds
    )
    db.add(template)
    await db.commit()
    await db.refresh(template)
    return template

@router.get("/{job_id}", response_model=JobDetailResponse)
async def get_job_detail(job_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch complete job requirements, criteria weights, and scoring thresholds"""
    result = await db.execute(
        select(Job)
        .filter(Job.id == job_id)
        .options(
            selectinload(Job.requirements),
            selectinload(Job.criteria),
            selectinload(Job.applications)
        )
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job position not found.")

    resp = JobDetailResponse.model_validate(job)
    resp.requirements_count = len(job.requirements)
    resp.applications_count = len(job.applications)
    return resp

@router.post("", response_model=JobDetailResponse)
async def create_job(
    req: JobCreate,
    current_user: User = Depends(require_roles(UserRole.OWNER, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a full job requirement specification.
    Strictly validates criteria total weight == 100%.
    """
    # 1. Validate Criteria Weight Sum == 100%
    if req.criteria:
        total_weight = sum(c.weight_percentage for c in req.criteria)
        if abs(total_weight - 100.0) > 0.01:
            raise HTTPException(
                status_code=400,
                detail=f"Criteria weight validation failed: Total weight must equal exactly 100.0%. Current total: {total_weight:.1f}%"
            )

    # Get owner profile
    owner_profile_id = 1
    if current_user.role == UserRole.OWNER:
        owner_res = await db.execute(select(OwnerProfile).filter(OwnerProfile.user_id == current_user.id))
        owner_p = owner_res.scalars().first()
        if not owner_p:
            raise HTTPException(status_code=400, detail="Owner profile not configured.")
        owner_profile_id = owner_p.id

    new_job = Job(
        owner_id=owner_profile_id,
        title=req.title,
        department=req.department,
        category=req.category,
        description=req.description,
        responsibilities=req.responsibilities,
        employment_type=req.employment_type,
        work_mode=req.work_mode,
        location=req.location,
        salary_range=req.salary_range,
        openings=req.openings,
        deadline=req.deadline,
        status=req.status,
        min_score_threshold=req.min_score_threshold,
        category_thresholds=req.category_thresholds,
        current_criteria_version=1
    )
    db.add(new_job)
    await db.flush()

    # Add Requirements
    for r in req.requirements:
        req_item = JobRequirement(
            job_id=new_job.id,
            type=r.type,
            name=r.name,
            level=r.level,
            is_required=r.is_required,
            weight=r.weight,
            min_score=r.min_score,
            is_knockout=r.is_knockout,
            details=r.details
        )
        db.add(req_item)

    # Add Criteria Categories
    for c in req.criteria:
        crit_item = JobCriteria(
            job_id=new_job.id,
            category_name=c.category_name,
            weight_percentage=c.weight_percentage,
            sub_weights=c.sub_weights
        )
        db.add(crit_item)

    # Create Initial Criteria Version Snapshot
    criteria_snapshot = [c.dict() for c in req.criteria]
    version_entry = CriteriaVersion(
        job_id=new_job.id,
        version_number=1,
        changed_by=current_user.full_name,
        criteria_snapshot=criteria_snapshot
    )
    db.add(version_entry)

    await db.commit()

    await AuditService.log_event(
        db=db,
        action="JOB_CREATED",
        user=current_user,
        target_type="Job",
        target_id=str(new_job.id),
        details={"title": new_job.title, "openings": new_job.openings}
    )

    return await get_job_detail(new_job.id, db)

@router.put("/{job_id}", response_model=JobDetailResponse)
async def update_job(
    job_id: int,
    req: JobUpdate,
    current_user: User = Depends(require_roles(UserRole.OWNER, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Updates job and records a criteria version snapshot if criteria modified"""
    result = await db.execute(
        select(Job).filter(Job.id == job_id).options(selectinload(Job.criteria), selectinload(Job.requirements))
    )
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if req.title is not None: job.title = req.title
    if req.department is not None: job.department = req.department
    if req.category is not None: job.category = req.category
    if req.description is not None: job.description = req.description
    if req.responsibilities is not None: job.responsibilities = req.responsibilities
    if req.employment_type is not None: job.employment_type = req.employment_type
    if req.work_mode is not None: job.work_mode = req.work_mode
    if req.location is not None: job.location = req.location
    if req.salary_range is not None: job.salary_range = req.salary_range
    if req.openings is not None: job.openings = req.openings
    if req.deadline is not None: job.deadline = req.deadline
    if req.status is not None: job.status = req.status
    if req.min_score_threshold is not None: job.min_score_threshold = req.min_score_threshold
    if req.category_thresholds is not None: job.category_thresholds = req.category_thresholds

    # Update criteria if provided
    if req.criteria is not None:
        total = sum(c.weight_percentage for c in req.criteria)
        if abs(total - 100.0) > 0.01:
            raise HTTPException(status_code=400, detail=f"Criteria total weight must equal 100%. Got {total:.1f}%")

        job.current_criteria_version += 1
        # Clear old criteria
        for c in job.criteria:
            await db.delete(c)
        for c in req.criteria:
            crit_item = JobCriteria(
                job_id=job.id,
                category_name=c.category_name,
                weight_percentage=c.weight_percentage,
                sub_weights=c.sub_weights
            )
            db.add(crit_item)

        # Snapshot version
        version_entry = CriteriaVersion(
            job_id=job.id,
            version_number=job.current_criteria_version,
            changed_by=current_user.full_name,
            criteria_snapshot=[c.dict() for c in req.criteria]
        )
        db.add(version_entry)

    # Update requirements if provided
    if req.requirements is not None:
        for r in job.requirements:
            await db.delete(r)
        for r in req.requirements:
            req_item = JobRequirement(
                job_id=job.id,
                type=r.type,
                name=r.name,
                level=r.level,
                is_required=r.is_required,
                weight=r.weight,
                min_score=r.min_score,
                is_knockout=r.is_knockout,
                details=r.details
            )
            db.add(req_item)

    await db.commit()

    await AuditService.log_event(
        db=db,
        action="JOB_UPDATED",
        user=current_user,
        target_type="Job",
        target_id=str(job.id),
        details={"version": job.current_criteria_version}
    )

    return await get_job_detail(job.id, db)

@router.delete("/{job_id}")
async def delete_job(
    job_id: int,
    current_user: User = Depends(require_roles(UserRole.OWNER, UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Job).filter(Job.id == job_id))
    job = result.scalars().first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    
    await db.delete(job)
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="JOB_DELETED",
        user=current_user,
        target_type="Job",
        target_id=str(job_id)
    )
    return {"message": "Job deleted successfully."}
