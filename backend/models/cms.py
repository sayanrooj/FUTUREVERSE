from datetime import datetime
import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class TicketStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    WAITING_CANDIDATE = "Waiting for Candidate"
    RESOLVED = "Resolved"
    CLOSED = "Closed"

class CompanyContent(Base):
    __tablename__ = "company_content"

    id = Column(Integer, primary_key=True, index=True)
    section_key = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    body = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    date_str = Column(String(100), nullable=False)
    category = Column(String(100), default="Milestone")
    metric = Column(String(100), nullable=True)  # e.g. "98.4% Match Accuracy"
    icon = Column(String(50), default="Award")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    date_str = Column(String(100), nullable=False)
    time_str = Column(String(100), nullable=False)
    location = Column(String(255), default="Virtual / Hybrid")
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    registration_link = Column(String(500), nullable=True)
    status = Column(String(50), default="UPCOMING")  # UPCOMING, PAST
    created_at = Column(DateTime, default=datetime.utcnow)

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject = Column(String(255), nullable=False)
    category = Column(String(100), default="General Inquiry")
    message = Column(Text, nullable=False)
    status = Column(String(50), default=TicketStatus.OPEN.value)
    priority = Column(String(20), default="MEDIUM")  # LOW, MEDIUM, HIGH, URGENT
    replies = Column(JSON, default=list)  # Legacy fallback [{author, role, message, timestamp}]
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="support_tickets")
    messages = relationship("SupportMessage", back_populates="ticket", cascade="all, delete-orphan", order_by="SupportMessage.created_at")

class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(50), default="CANDIDATE")  # CANDIDATE, ADMIN, SUPER_ADMIN, OWNER
    sender_name = Column(String(150), nullable=True)
    message = Column(Text, nullable=False)
    attachment_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)

    ticket = relationship("SupportTicket", back_populates="messages")
    sender = relationship("User")

class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, nullable=True)
    application_id = Column(Integer, nullable=True)
    recipient = Column(String(255), nullable=False)
    email_type = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    related_entity_id = Column(String(100), nullable=True)
    status = Column(String(50), default="SENT")  # PENDING, SENT, FAILED
    provider_message_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    content_html = Column(Text, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # INFO, SUCCESS, WARNING, INTERVIEW, APPLICATION
    is_read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")
