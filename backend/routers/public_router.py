from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any, List

from backend.database import get_db
from backend.models.cms import CompanyContent, Achievement, Event, SupportTicket
from backend.models.user import User

router = APIRouter(prefix="/api/public", tags=["Public Content & Inquiries"])

@router.get("/content")
async def get_public_content(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CompanyContent))
    items = result.scalars().all()
    return {c.section_key: {"title": c.title, "subtitle": c.subtitle, "body": c.body, "metadata": c.metadata_json} for c in items}

@router.get("/achievements")
async def get_public_achievements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Achievement).filter(Achievement.is_active == True).order_by(Achievement.created_at.desc()))
    return result.scalars().all()

@router.get("/events")
async def get_public_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).order_by(Event.created_at.desc()))
    return result.scalars().all()

@router.post("/contact")
async def submit_contact_form(data: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    """Receives contact inquiries from the public website"""
    # Create ticket for first admin/user
    user_res = await db.execute(select(User).limit(1))
    first_user = user_res.scalars().first()
    uid = first_user.id if first_user else 1

    ticket = SupportTicket(
        user_id=uid,
        subject=f"Inquiry from {data.get('name', 'Visitor')} ({data.get('email', '')})",
        category="Public Contact Inquiry",
        message=f"Name: {data.get('name')}\nEmail: {data.get('email')}\nPhone: {data.get('phone', 'N/A')}\nMessage:\n{data.get('message', '')}"
    )
    db.add(ticket)
    await db.commit()

    return {"message": "Thank you for reaching out to FUTUREVERSE. Our recruitment advisory team will connect with you shortly."}
