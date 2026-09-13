from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from backend.database import get_db
from backend.models.user import User, CandidateProfile, OwnerProfile, UserRole
from backend.schemas.auth import (
    CandidateRegister, UserLogin, Token, UserResponse,
    PasswordResetRequest, PasswordResetConfirm
)
from backend.services.auth_service import (
    hash_password, verify_password, create_access_token, get_current_user
)
from backend.services.audit_service import AuditService
from backend.services.notification_service import NotificationService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register_candidate(req: CandidateRegister, request: Request, db: AsyncSession = Depends(get_db)):
    """Public registration strictly for Candidates only"""
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    # Check email duplicate
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=UserRole.CANDIDATE,
        is_active=True
    )
    db.add(new_user)
    await db.flush()

    # Create candidate profile
    cand_profile = CandidateProfile(
        user_id=new_user.id,
        headline="Emerging Professional",
        skills=[]
    )
    db.add(cand_profile)
    await db.commit()
    await db.refresh(new_user)

    # Log audit event
    await AuditService.log_event(
        db=db,
        action="CANDIDATE_REGISTER",
        user=new_user,
        target_type="User",
        target_id=str(new_user.id),
        details={"email": new_user.email},
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    # Welcome email
    await NotificationService.send_email(
        to_email=new_user.email,
        recipient_name=new_user.full_name,
        subject="Welcome to FUTUREVERSE — Your Intelligent Career Journey",
        body_html="<p>Welcome to FUTUREVERSE! Your candidate profile is ready. Upload your CV to receive instant AI matching and explore premier career opportunities.</p>"
    )

    # Issue token
    token = create_access_token({"sub": str(new_user.id), "user_id": new_user.id, "role": new_user.role.value, "email": new_user.email})
    return Token(
        access_token=token,
        role=new_user.role,
        user_id=new_user.id,
        full_name=new_user.full_name,
        email=new_user.email
    )

@router.post("/login", response_model=Token)
async def login(req: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    """General login for Candidates and all users"""
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated. Contact platform support.")

    # Check if Owner is disabled
    if user.role == UserRole.OWNER:
        owner_res = await db.execute(select(OwnerProfile).filter(OwnerProfile.user_id == user.id))
        owner_p = owner_res.scalars().first()
        if owner_p and owner_p.is_disabled:
            raise HTTPException(status_code=403, detail="Your recruiter account has been disabled by the Super Admin.")

    user.last_login = datetime.utcnow()
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="LOGIN_SUCCESS",
        user=user,
        details={"role": user.role.value},
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    token = create_access_token({"sub": str(user.id), "user_id": user.id, "role": user.role.value, "email": user.email})
    return Token(
        access_token=token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.post("/owner-login", response_model=Token)
async def owner_login(req: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    """Dedicated recruiter / owner login. Strictly prevents non-owner logins."""
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid recruiter credentials.")

    if user.role != UserRole.OWNER:
        raise HTTPException(status_code=403, detail="Access denied: This portal is reserved exclusively for authorized Recruiters & Owners.")

    owner_res = await db.execute(select(OwnerProfile).filter(OwnerProfile.user_id == user.id))
    owner_p = owner_res.scalars().first()
    if owner_p and owner_p.is_disabled:
        raise HTTPException(status_code=403, detail="Your recruiter account has been disabled by the Super Admin.")

    user.last_login = datetime.utcnow()
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="OWNER_LOGIN_SUCCESS",
        user=user,
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    token = create_access_token({"sub": str(user.id), "user_id": user.id, "role": user.role.value, "email": user.email})
    return Token(
        access_token=token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.post("/admin-login", response_model=Token)
async def admin_login(req: UserLogin, request: Request, db: AsyncSession = Depends(get_db)):
    """Dedicated Super Admin portal login"""
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid administrator credentials.")

    if user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Access denied: Requires Super Admin privileges.")

    user.last_login = datetime.utcnow()
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="SUPER_ADMIN_LOGIN_SUCCESS",
        user=user,
        ip_address=request.client.host if request.client else "127.0.0.1"
    )

    token = create_access_token({"sub": str(user.id), "user_id": user.id, "role": user.role.value, "email": user.email})
    return Token(
        access_token=token,
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        email=user.email
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Returns current active authenticated user session"""
    return current_user

@router.post("/forgot-password")
async def forgot_password(req: PasswordResetRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    user = result.scalars().first()
    if user:
        await NotificationService.send_email(
            to_email=user.email,
            recipient_name=user.full_name,
            subject="FUTUREVERSE — Password Reset Request",
            body_html="<p>We received a password reset request. Use code <strong>RESET-2026</strong> to finalize your new password.</p>"
        )
    return {"message": "If this email is registered, a password reset instruction has been dispatched."}

@router.post("/reset-password")
async def reset_password(req: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == req.email.lower()))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")
    user.hashed_password = hash_password(req.new_password)
    await db.commit()
    return {"message": "Password updated successfully. Please log in with your new credentials."}
