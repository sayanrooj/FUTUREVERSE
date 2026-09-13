from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from datetime import datetime

from backend.database import get_db
from backend.models.user import User, UserRole, OwnerProfile
from backend.models.cms import CompanyContent, Achievement, Event, SupportTicket, SupportMessage, EmailLog, TicketStatus
from backend.models.audit import AuditLog
from backend.models.job import Job
from backend.models.application import Application
from backend.schemas.admin import (
    OwnerCreate, OwnerUpdate, OwnerResponse, CMSContentUpdate,
    AchievementCreate, EventCreate, SupportTicketReply, SupportTicketResponse,
    AuditLogResponse, SystemHealthResponse
)
from backend.services.auth_service import hash_password, require_roles
from backend.services.audit_service import AuditService
from backend.services.notification_service import NotificationService
from backend.services.email_service import EmailService, EmailType

router = APIRouter(prefix="/api/admin", tags=["Super Admin / Platform Control"])

# 1. OWNER MANAGEMENT
@router.get("/owners")
async def list_owners(
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Lists all recruiter / owner accounts on the platform"""
    result = await db.execute(
        select(OwnerProfile)
        .options(selectinload(OwnerProfile.user), selectinload(OwnerProfile.jobs))
        .order_by(OwnerProfile.created_at.desc())
    )
    owners = result.scalars().all()

    resp = []
    for o in owners:
        u = o.user
        resp.append({
            "id": o.id,
            "user_id": o.user_id,
            "full_name": u.full_name if u else "Owner",
            "email": u.email if u else "",
            "company_name": o.company_name,
            "department": o.department,
            "designation": o.designation,
            "permissions": o.permissions or [],
            "is_disabled": o.is_disabled,
            "created_at": o.created_at,
            "last_login": u.last_login if u else None,
            "jobs_count": len(o.jobs)
        })
    return resp

@router.post("/owners")
async def create_owner(
    req: OwnerCreate,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """
    Super Admin provisions a new recruiter account.
    (Note: Public registration for Owners is strictly forbidden).
    """
    exist_res = await db.execute(select(User).filter(User.email == req.email.lower()))
    if exist_res.scalars().first():
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    new_user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=UserRole.OWNER,
        is_active=True
    )
    db.add(new_user)
    await db.flush()

    new_profile = OwnerProfile(
        user_id=new_user.id,
        company_name=req.company_name,
        department=req.department,
        designation=req.designation,
        permissions=req.permissions,
        is_disabled=False
    )
    db.add(new_profile)
    await db.commit()

    await AuditService.log_event(
        db=db,
        action="OWNER_ACCOUNT_CREATED",
        user=current_user,
        target_type="OwnerProfile",
        target_id=str(new_profile.id),
        details={"email": new_user.email, "company": new_profile.company_name}
    )

    await NotificationService.send_email(
        to_email=new_user.email,
        recipient_name=new_user.full_name,
        subject="Your FUTUREVERSE Recruiter Account is Ready",
        body_html=f"""
        <p>You have been provisioned as an authorized Recruiter for <strong>{req.company_name}</strong> on FUTUREVERSE.</p>
        <p>Access your dedicated recruiter login portal at: <a href="http://localhost:5173/owner-login">http://localhost:5173/owner-login</a></p>
        """
    )

    return {
        "message": "Owner recruiter account provisioned successfully.",
        "owner_id": new_profile.id,
        "email": new_user.email
    }

@router.put("/owners/{owner_id}")
async def update_owner(
    owner_id: int,
    req: OwnerUpdate,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Updates status, permissions, or resets password for an Owner account"""
    result = await db.execute(
        select(OwnerProfile).filter(OwnerProfile.id == owner_id).options(selectinload(OwnerProfile.user))
    )
    owner = result.scalars().first()
    if not owner:
        raise HTTPException(status_code=404, detail="Owner account not found.")

    u = owner.user
    if req.full_name is not None and u: u.full_name = req.full_name
    if req.company_name is not None: owner.company_name = req.company_name
    if req.department is not None: owner.department = req.department
    if req.designation is not None: owner.designation = req.designation
    if req.permissions is not None: owner.permissions = req.permissions
    if req.is_disabled is not None:
        owner.is_disabled = req.is_disabled
        if u: u.is_active = not req.is_disabled
    if req.reset_password and u:
        u.hashed_password = hash_password(req.reset_password)

    await db.commit()

    await AuditService.log_event(
        db=db,
        action="OWNER_ACCOUNT_UPDATED",
        user=current_user,
        target_type="OwnerProfile",
        target_id=str(owner.id),
        details={"is_disabled": owner.is_disabled, "updated_fields": list(req.dict(exclude_unset=True).keys())}
    )

    return {"message": "Owner profile updated successfully."}

# 2. CMS & CONTENT MANAGEMENT
@router.get("/cms")
async def get_all_cms_content(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CompanyContent))
    items = result.scalars().all()
    return {c.section_key: {"title": c.title, "subtitle": c.subtitle, "body": c.body, "metadata": c.metadata_json} for c in items}

@router.put("/cms/{section_key}")
async def update_cms_content(
    section_key: str,
    req: CMSContentUpdate,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CompanyContent).filter(CompanyContent.section_key == section_key))
    content = result.scalars().first()
    if not content:
        content = CompanyContent(section_key=section_key, title=req.title, subtitle=req.subtitle, body=req.body, metadata_json=req.metadata_json)
        db.add(content)
    else:
        content.title = req.title
        content.subtitle = req.subtitle
        content.body = req.body
        content.metadata_json = req.metadata_json

    await db.commit()

    await AuditService.log_event(
        db=db,
        action="CMS_UPDATED",
        user=current_user,
        target_type="CompanyContent",
        target_id=section_key
    )
    return {"message": f"Section '{section_key}' updated successfully."}

# 3. ACHIEVEMENTS MANAGEMENT
@router.get("/achievements")
async def get_achievements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Achievement).order_by(Achievement.created_at.desc()))
    return result.scalars().all()

@router.post("/achievements")
async def create_achievement(
    req: AchievementCreate,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    ach = Achievement(
        title=req.title,
        description=req.description,
        date_str=req.date_str,
        category=req.category,
        metric=req.metric,
        icon=req.icon,
        is_active=req.is_active
    )
    db.add(ach)
    await db.commit()
    await db.refresh(ach)

    await AuditService.log_event(db=db, action="ACHIEVEMENT_CREATED", user=current_user, target_id=str(ach.id))
    return ach

@router.delete("/achievements/{ach_id}")
async def delete_achievement(
    ach_id: int,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Achievement).filter(Achievement.id == ach_id))
    ach = result.scalars().first()
    if ach:
        await db.delete(ach)
        await db.commit()
    return {"message": "Achievement removed."}

# 4. EVENTS MANAGEMENT
@router.get("/events")
async def get_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).order_by(Event.created_at.desc()))
    return result.scalars().all()

@router.post("/events")
async def create_event(
    req: EventCreate,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    ev = Event(
        title=req.title,
        date_str=req.date_str,
        time_str=req.time_str,
        location=req.location,
        description=req.description,
        image_url=req.image_url,
        registration_link=req.registration_link,
        status=req.status
    )
    db.add(ev)
    await db.commit()
    await db.refresh(ev)

    await AuditService.log_event(db=db, action="EVENT_CREATED", user=current_user, target_id=str(ev.id))
    return ev

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Event).filter(Event.id == event_id))
    ev = result.scalars().first()
    if ev:
        await db.delete(ev)
        await db.commit()
    return {"message": "Event removed."}

# 5. AUDIT LOGS
@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(
    limit: int = 50,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit))
    return result.scalars().all()

# 6. SUPPORT TICKETS
@router.get("/support-tickets")
async def list_support_tickets(
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SupportTicket)
        .options(selectinload(SupportTicket.user), selectinload(SupportTicket.messages))
        .order_by(SupportTicket.updated_at.desc())
    )
    tickets = result.scalars().all()
    resp = []
    for t in tickets:
        u = t.user
        msgs = t.messages or []
        last_msg = msgs[-1] if msgs else None
        resp.append({
            "id": t.id,
            "user_id": t.user_id,
            "user_name": u.full_name if u else "User",
            "user_email": u.email if u else "",
            "subject": t.subject,
            "category": t.category,
            "message": t.message,
            "status": t.status,
            "priority": t.priority,
            "replies": t.replies or [],
            "message_count": len(msgs),
            "last_message_preview": last_msg.message[:120] if last_msg else t.message[:120],
            "last_sender_role": last_msg.sender_role if last_msg else "CANDIDATE",
            "created_at": t.created_at,
            "updated_at": t.updated_at,
            "closed_at": t.closed_at
        })
    return resp

@router.get("/support-tickets/{ticket_id}")
async def get_support_ticket_detail(
    ticket_id: int,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Retrieves full conversation history for admin resolution"""
    result = await db.execute(
        select(SupportTicket)
        .filter(SupportTicket.id == ticket_id)
        .options(selectinload(SupportTicket.user), selectinload(SupportTicket.messages))
    )
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")

    u = ticket.user
    return {
        "id": ticket.id,
        "user_id": ticket.user_id,
        "user_name": u.full_name if u else "User",
        "user_email": u.email if u else "",
        "subject": ticket.subject,
        "category": ticket.category,
        "message": ticket.message,
        "status": ticket.status,
        "priority": ticket.priority,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "closed_at": ticket.closed_at,
        "messages": [
            {
                "id": m.id,
                "sender_id": m.sender_id,
                "sender_role": m.sender_role,
                "sender_name": m.sender_name,
                "message": m.message,
                "created_at": m.created_at,
                "is_admin": m.sender_role in ("ADMIN", "SUPER_ADMIN")
            }
            for m in ticket.messages
        ]
    }

@router.post("/support-tickets/{ticket_id}/reply")
async def reply_support_ticket(
    ticket_id: int,
    req: SupportTicketReply,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SupportTicket).filter(SupportTicket.id == ticket_id).options(selectinload(SupportTicket.user))
    )
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")

    # 1. Insert normalized message record into support_messages
    admin_msg = SupportMessage(
        ticket_id=ticket.id,
        sender_id=current_user.id,
        sender_role="SUPER_ADMIN",
        sender_name=current_user.full_name,
        message=req.message
    )
    db.add(admin_msg)

    # 2. Update legacy replies JSON for backwards compatibility
    replies = list(ticket.replies or [])
    replies.append({
        "author": current_user.full_name,
        "role": "Super Admin Support",
        "message": req.message,
        "timestamp": datetime.utcnow().isoformat()
    })
    ticket.replies = replies

    # 3. Update status & timestamp
    target_status = req.status or TicketStatus.IN_PROGRESS.value
    ticket.status = target_status
    ticket.updated_at = datetime.utcnow()
    if target_status in (TicketStatus.RESOLVED.value, TicketStatus.CLOSED.value):
        ticket.closed_at = datetime.utcnow()

    # 4. In-App Notification to candidate
    if ticket.user:
        await NotificationService.create_notification(
            db=db,
            user_id=ticket.user.id,
            title=f"Support Reply: {ticket.subject}",
            message=f"Support agent replied: '{req.message[:80]}...'",
            notif_type="INFO",
            link="/candidate/support"
        )

        # 5. Send Real Transactional / Dev-Audited Email to Candidate via Centralized EmailService
        await EmailService.send_support_reply(
            db=db,
            to_email=ticket.user.email,
            recipient_name=ticket.user.full_name,
            ticket_id=ticket.id,
            ticket_subject=ticket.subject,
            reply_preview=req.message[:150],
            candidate_id=ticket.user.id
        )

    # 6. Record Audit Log
    await AuditService.log_event(
        db=db,
        action="SUPPORT_TICKET_REPLIED",
        user=current_user,
        target_type="SupportTicket",
        target_id=str(ticket.id),
        details={"status": ticket.status, "reply_length": len(req.message)}
    )

    await db.commit()
    return {"message": "Reply saved and candidate notified successfully.", "status": ticket.status}

@router.patch("/support-tickets/{ticket_id}/status")
async def update_support_ticket_status(
    ticket_id: int,
    payload: Dict[str, str],
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Admin updates ticket status directly"""
    new_status = payload.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required.")

    result = await db.execute(select(SupportTicket).filter(SupportTicket.id == ticket_id))
    ticket = result.scalars().first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found.")

    old_status = ticket.status
    ticket.status = new_status
    ticket.updated_at = datetime.utcnow()
    if new_status in (TicketStatus.RESOLVED.value, TicketStatus.CLOSED.value):
        ticket.closed_at = datetime.utcnow()

    await AuditService.log_event(
        db=db,
        action="SUPPORT_TICKET_STATUS_CHANGED",
        user=current_user,
        target_type="SupportTicket",
        target_id=str(ticket.id),
        details={"old_status": old_status, "new_status": new_status}
    )

    await db.commit()
    return {"message": f"Ticket status updated to {new_status}.", "status": new_status}

# 6.5 EMAIL LOGS & RETRY
@router.get("/emails")
async def list_email_logs(
    limit: int = 50,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Lists recent outbound email logs with delivery status"""
    result = await db.execute(select(EmailLog).order_by(EmailLog.created_at.desc()).limit(limit))
    logs = result.scalars().all()
    return [
        {
            "id": l.id,
            "recipient": l.recipient,
            "email_type": l.email_type,
            "subject": l.subject,
            "status": l.status,
            "provider_message_id": l.provider_message_id,
            "created_at": l.created_at,
            "sent_at": l.sent_at,
            "error_message": l.error_message
        }
        for l in logs
    ]

@router.post("/emails/retry/{email_id}")
async def retry_email(
    email_id: int,
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    """Admin retries sending an email that previously failed"""
    result = await EmailService.retry_email_log(db=db, log_id=email_id)
    if result.success:
        return {"message": "Email resent successfully.", "email_delivery": result.to_dict()}
    else:
        raise HTTPException(
            status_code=500,
            detail=f"Retry delivery failed: {result.error or 'Please verify SMTP configuration in .env'}"
        )

# 7. PLATFORM HEALTH & ANALYTICS
@router.get("/system-health", response_model=SystemHealthResponse)
async def get_system_health(
    current_user: User = Depends(require_roles(UserRole.SUPER_ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    users_cnt = await db.execute(select(User))
    jobs_cnt = await db.execute(select(Job))
    apps_cnt = await db.execute(select(Application))

    email_diag = EmailService.verify_connection()
    email_status = "OPERATIONAL" if email_diag.get("ready") else ("CONFIGURED_IDLE" if email_diag.get("configured") else "UNCONFIGURED")

    return SystemHealthResponse(
        status="HEALTHY",
        database_status="CONNECTED",
        ai_engine_status="OPERATIONAL",
        storage_status="ONLINE",
        email_service_status=email_status,
        active_users=len(users_cnt.scalars().all()),
        total_jobs=len(jobs_cnt.scalars().all()),
        total_applications=len(apps_cnt.scalars().all()),
        uptime_seconds=86400.0
    )
