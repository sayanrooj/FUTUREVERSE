import asyncio
import smtplib
import uuid
import re
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from enum import Enum
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.config import settings
from backend.models.cms import EmailLog
from backend.utils.time_utils import format_ist_datetime, now_ist


class EmailType(str, Enum):
    AI_INTERVIEW_INVITATION = "AI_INTERVIEW_INVITATION"
    FACE_TO_FACE_INTERVIEW_INVITATION = "FACE_TO_FACE_INTERVIEW_INVITATION"
    FINAL_SELECTED = "FINAL_SELECTED"
    FINAL_NOT_SELECTED = "FINAL_NOT_SELECTED"
    INTERVIEW_REMINDER = "INTERVIEW_REMINDER"
    SUPPORT_REPLY = "SUPPORT_REPLY"
    APPLICATION_UPDATE = "APPLICATION_UPDATE"
    TRANSACTIONAL = "TRANSACTIONAL"


class EmailDeliveryResult:
    """Encapsulates transactional email dispatch outcome with boolean truthiness and telemetry."""
    def __init__(
        self,
        success: bool,
        status: str,
        error: Optional[str] = None,
        log_id: Optional[int] = None,
        provider_message_id: Optional[str] = None
    ):
        self.success = success
        self.status = status
        self.error = error
        self.log_id = log_id
        self.provider_message_id = provider_message_id

    def __bool__(self):
        return self.success

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "status": self.status,
            "error": self.error,
            "log_id": self.log_id,
            "provider_message_id": self.provider_message_id
        }

    def __getitem__(self, item):
        return self.to_dict()[item]


def resolve_domain_metadata(job_title: str, department: Optional[str] = None) -> Dict[str, Any]:
    """
    Intelligently maps job title and department into a specialized recruitment domain track.
    Tailors competencies, assessment focus, round objectives, and cohort identities.
    """
    text = f"{job_title} {department or ''}".lower()

    if any(k in text for k in ["ai", "machine learning", "deep learning", "nlp", "llm", "vision", "cognitive", "cse"]):
        return {
            "domain_code": "AI_COGNITIVE",
            "domain_name": "Artificial Intelligence & Cognitive Systems",
            "domain_badge": "AI & COGNITIVE SYSTEMS TRACK",
            "color_accent": "#38bdf8",
            "competencies": "Transformer Architectures, PyTorch, Neural Optimization, LLM Reasoning, Vector Datastores & MLOps",
            "ai_assessment_focus": "Adaptive Proctored Technical Coding, Matrix Operations, Latency Profiling, and AI Cognitive Reasoning",
            "f2f_round_focus": "Deep AI System Design, Distributed Model Inference, High-Throughput Pipelines, and Alignment Safety",
            "offer_cohort": "Artificial Intelligence & Cognitive Systems Engineering Cohort"
        }
    elif any(k in text for k in ["devops", "infrastructure", "cloud", "sre", "platform", "kubernetes", "docker", "terraform"]):
        return {
            "domain_code": "CLOUD_DEVOPS",
            "domain_name": "Cloud Infrastructure & DevOps",
            "domain_badge": "CLOUD INFRASTRUCTURE & DEVOPS TRACK",
            "color_accent": "#0ea5e9",
            "competencies": "Kubernetes Orchestration, CI/CD Automation, Terraform IaC, Zero-Trust Cloud Security & Distributed Telemetry",
            "ai_assessment_focus": "Infrastructure Scripting, Container Lifecycle, Networking Protocols, and Shell Automation Logic",
            "f2f_round_focus": "Cloud Resiliency, Zero-Trust Cluster Architecture, Disaster Recovery Simulation, and Telemetry Systems",
            "offer_cohort": "Cloud Infrastructure & DevOps Architecture Cohort"
        }
    elif any(k in text for k in ["frontend", "ui", "ux", "design", "css", "web"]):
        return {
            "domain_code": "FRONTEND_DESIGN",
            "domain_name": "Frontend Architecture & UI/UX Design",
            "domain_badge": "FRONTEND ARCHITECTURE & UI/UX TRACK",
            "color_accent": "#f59e0b",
            "competencies": "Modern Reactive Architectures, State Machines, Core Web Vitals Optimization, Design Systems & Human-Centered UX",
            "ai_assessment_focus": "Component Lifecycle, UI Performance Profiling, Responsive Layouts, and Interactive Logic",
            "f2f_round_focus": "Design System Scalability, Cross-Browser Rendering Engines, Micro-Frontend Architecture, and UX Review",
            "offer_cohort": "Frontend Architecture & UI/UX Design Cohort"
        }
    elif any(k in text for k in ["data analyst", "business intelligence", "analytics", "sql", "bi"]):
        return {
            "domain_code": "DATA_ANALYTICS",
            "domain_name": "Data Analytics & Strategic Intelligence",
            "domain_badge": "DATA ANALYTICS & STRATEGY TRACK",
            "color_accent": "#818cf8",
            "competencies": "Advanced SQL, Dimensional Modeling, Statistical Analysis, High-Volume ETL Pipelines & Predictive Dashboards",
            "ai_assessment_focus": "Query Optimization, Data Transformation Logic, Metric Formulation, and Statistical Reasoning",
            "f2f_round_focus": "Data Lakehouse Architecture, Real-Time Streaming Analytics, Data Quality Frameworks, and Strategic KPIs",
            "offer_cohort": "Data Analytics & Strategic Intelligence Cohort"
        }
    else:
        return {
            "domain_code": "FULLSTACK_DISTRIBUTED",
            "domain_name": "Full Stack & Distributed Systems",
            "domain_badge": "FULL STACK & DISTRIBUTED SYSTEMS TRACK",
            "color_accent": "#10b981",
            "competencies": "Microservices Architecture, High-Concurrency APIs, Relational & NoSQL Datastores, Distributed Caching & Clean Code",
            "ai_assessment_focus": "Algorithm Design, Concurrency, API Contracts, and End-to-End System Reliability",
            "f2f_round_focus": "End-to-End Scalability, Database Indexing & Partitioning, Asynchronous Event Streams, and System Resiliency",
            "offer_cohort": "Full Stack & Distributed Product Delivery Cohort"
        }


def _dispatch_smtp_sync(
    host: str,
    port: int,
    user: str,
    password: str,
    use_tls: bool,
    use_ssl: bool,
    email_from: str,
    to_email: str,
    msg_raw: str
) -> str:
    """
    Synchronous worker executed in a background thread to prevent blocking
    the FastAPI asyncio event loop. Eliminates UI lag completely.
    """
    if use_ssl or port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=12) as server:
            server.login(user, password)
            server.sendmail(email_from, to_email, msg_raw)
    else:
        with smtplib.SMTP(host, port, timeout=12) as server:
            if use_tls:
                server.starttls()
            server.login(user, password)
            server.sendmail(email_from, to_email, msg_raw)
    return f"smtp-{uuid.uuid4().hex[:12]}"


class EmailService:
    """
    FUTUREVERSE Centralized Real Email Delivery & Communications Engine
    Created & Developed by Sayan Rooj

    Features:
    - Zero-Lag Asynchronous Threading (asyncio.to_thread)
    - Domain-Specific Recruitment Intelligence (AI, DevOps, Full Stack, UI/UX, Data)
    - Instant Dispatch Every Time (no false debounce suppression)
    - Responsive HTML + Text Fallback with IST Timestamps
    - Full DB Auditing via EmailLog
    """

    @classmethod
    def verify_connection(cls) -> Dict[str, Any]:
        """Validates SMTP configuration safely without leaking credentials."""
        host = settings.SMTP_HOST
        port = settings.SMTP_PORT
        user = settings.SMTP_USER
        has_creds = bool(user and settings.SMTP_PASSWORD)

        if not has_creds:
            msg = (
                f"[EMAIL SERVICE] NOT CONFIGURED: EMAIL_USERNAME and EMAIL_PASSWORD are not set in .env. "
                f"Outbound transactional emails will be recorded as FAILED in database logs."
            )
            print(msg)
            return {
                "configured": False,
                "ready": False,
                "host": host,
                "port": port,
                "user": user or "(unconfigured)",
                "error": "SMTP credentials missing in environment"
            }

        masked_user = user[:3] + "***" + user[user.find("@"):] if "@" in user else user[:3] + "***"

        try:
            if settings.EMAIL_USE_SSL or port == 465:
                server = smtplib.SMTP_SSL(host, port, timeout=5)
            else:
                server = smtplib.SMTP(host, port, timeout=5)
                if settings.EMAIL_USE_TLS:
                    server.starttls()

            server.login(user, settings.SMTP_PASSWORD)
            server.quit()

            status_msg = (
                f"[EMAIL SERVICE] CONFIGURED & READY: Connected to {host}:{port} "
                f"as {masked_user} (TLS: {settings.EMAIL_USE_TLS})"
            )
            print(status_msg)
            return {
                "configured": True,
                "ready": True,
                "host": host,
                "port": port,
                "user": masked_user,
                "error": None
            }
        except Exception as e:
            err_msg = str(e)
            print(f"[EMAIL SERVICE] CONNECTION TEST FAILED: Unable to authenticate with {host}:{port} - {err_msg}")
            return {
                "configured": True,
                "ready": False,
                "host": host,
                "port": port,
                "user": masked_user,
                "error": err_msg
            }

    @staticmethod
    def _render_html(
        title: str,
        recipient_name: str,
        body_html: str,
        action_button: Optional[dict] = None,
        domain_badge: Optional[str] = None
    ) -> str:
        btn_html = ""
        if action_button and action_button.get("url"):
            btn_text = action_button.get("text", "Open FUTUREVERSE")
            btn_url = action_button.get("url", "#")
            btn_html = f"""
            <div style="margin: 32px 0; text-align: center;">
                <a href="{btn_url}" style="background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; display: inline-block; box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4); text-transform: uppercase;">
                    {btn_text}
                </a>
            </div>
            """

        badge_html = ""
        if domain_badge:
            badge_html = f"""
            <div style="margin: 8px 0 16px 0;">
                <span style="display: inline-block; padding: 4px 12px; background-color: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 9999px; color: #38bdf8; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                    🎯 {domain_badge}
                </span>
            </div>
            """

        ist_now = format_ist_datetime(now_ist())

        return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
    <div style="max-width: 620px; margin: 36px auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.6);">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 26px 24px; border-bottom: 1px solid #1f2937; text-align: center;">
            <h1 style="margin: 0; color: #38bdf8; font-size: 24px; letter-spacing: 2.5px; font-weight: 800;">FUTUREVERSE</h1>
            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">Enterprise AI Recruitment Operating System</p>
        </div>

        <!-- Main Body -->
        <div style="padding: 32px 28px; line-height: 1.65; color: #cbd5e1; font-size: 14px;">
            {badge_html}
            <p style="font-size: 16px; margin-top: 0; color: #f8fafc;">Hello <strong>{recipient_name}</strong>,</p>
            {body_html}
            {btn_html}
            <p style="margin-top: 30px; font-size: 13px; color: #94a3b8; border-top: 1px solid #1f2937; padding-top: 18px;">
                Warm regards,<br>
                <strong style="color: #f1f5f9;">FUTUREVERSE Talent Operations & Hiring Committee</strong><br>
                <span style="font-size: 11px; color: #64748b;">Dispatched: {ist_now}</span>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #0a0e17; padding: 20px 24px; text-align: center; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b; line-height: 1.6;">
            <p style="margin: 0; font-weight: 600; color: #94a3b8;">FUTUREVERSE © 2026 | Designed & Developed by Sayan Rooj</p>
            <p style="margin: 4px 0 0 0;">This is an authenticated enterprise recruitment communication. Inquiries are monitored via the FUTUREVERSE platform.</p>
        </div>
    </div>
</body>
</html>"""

    @staticmethod
    def _render_plain_text(
        recipient_name: str,
        body_text: str,
        action_button: Optional[dict] = None,
        domain_badge: Optional[str] = None
    ) -> str:
        btn_str = ""
        if action_button and action_button.get("url"):
            btn_str = f"\n\nLink: {action_button.get('text', 'Open link')}\n{action_button.get('url')}\n"

        badge_str = f"[{domain_badge}]\n\n" if domain_badge else ""
        ist_now = format_ist_datetime(now_ist())
        return (
            f"FUTUREVERSE | Enterprise AI Recruitment Platform\n\n"
            f"{badge_str}"
            f"Hello {recipient_name},\n\n"
            f"{body_text}"
            f"{btn_str}\n\n"
            f"Warm regards,\n"
            f"FUTUREVERSE Talent Operations & Hiring Committee\n"
            f"Dispatched: {ist_now}\n\n"
            f"FUTUREVERSE © 2026 | Designed & Developed by Sayan Rooj\n"
        )

    @classmethod
    async def send_email(
        cls,
        to_email: str,
        recipient_name: str,
        subject: str,
        body_html: str,
        plain_text: Optional[str] = None,
        action_button: Optional[dict] = None,
        db: Optional[AsyncSession] = None,
        email_type: str = EmailType.TRANSACTIONAL.value,
        related_entity_id: Optional[str] = None,
        candidate_id: Optional[int] = None,
        application_id: Optional[int] = None,
        domain_badge: Optional[str] = None
    ) -> EmailDeliveryResult:
        """
        Dispatches emails immediately every time using non-blocking worker threads.
        Completely eliminates system lag.
        """
        html_content = cls._render_html(subject, recipient_name, body_html, action_button, domain_badge)
        if not plain_text:
            plain_fallback = re.sub(r"<[^>]+>", " ", body_html)
            plain_fallback = re.sub(r"\s+", " ", plain_fallback).strip()
        else:
            plain_fallback = plain_text
        text_content = cls._render_plain_text(recipient_name, plain_fallback, action_button, domain_badge)

        status = "FAILED"
        error_msg = None
        provider_id = None

        # Validate recipient email address
        if not to_email or "@" not in to_email or "." not in to_email.split("@")[-1]:
            status = "FAILED"
            error_msg = f"Invalid recipient email syntax: '{to_email}'"
            print(f"[Email Service] Recipient validation failure: {error_msg}")

        elif settings.ENABLE_REAL_EMAIL and settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                from_header = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>" if settings.EMAIL_FROM_NAME else settings.EMAIL_FROM
                msg["From"] = from_header
                msg["To"] = to_email

                msg.attach(MIMEText(text_content, "plain", "utf-8"))
                msg.attach(MIMEText(html_content, "html", "utf-8"))

                # NON-BLOCKING ASYNC THREADING: Eliminates system lag
                provider_id = await asyncio.to_thread(
                    _dispatch_smtp_sync,
                    settings.SMTP_HOST,
                    settings.SMTP_PORT,
                    settings.SMTP_USER,
                    settings.SMTP_PASSWORD,
                    settings.EMAIL_USE_TLS,
                    settings.EMAIL_USE_SSL,
                    settings.EMAIL_FROM,
                    to_email,
                    msg.as_string()
                )
                status = "SENT"
                error_msg = None
                print(f"[Email Service] Outbound email DISPATCHED to {to_email} [{provider_id}] via non-blocking thread")
            except Exception as e:
                status = "FAILED"
                error_msg = f"SMTP dispatch error: {str(e)}"
                print(f"[Email Service] SMTP dispatch failure for {to_email}: {e}")
        else:
            status = "FAILED"
            error_msg = "SMTP unconfigured: EMAIL_USERNAME and EMAIL_PASSWORD are not configured in system environment."
            provider_id = f"smtp-unconfigured-{uuid.uuid4().hex[:8]}"
            print(f"[Email Service] Delivery status marked FAILED for {to_email}: {error_msg}")

        # Save to database log
        log_id = None
        if db:
            try:
                log_entry = EmailLog(
                    candidate_id=candidate_id,
                    application_id=application_id,
                    recipient=to_email,
                    email_type=email_type,
                    subject=subject,
                    related_entity_id=str(related_entity_id) if related_entity_id else None,
                    status=status,
                    provider_message_id=provider_id,
                    sent_at=datetime.utcnow() if status == "SENT" else None,
                    error_message=error_msg,
                    content_html=html_content
                )
                db.add(log_entry)
                await db.commit()
                await db.refresh(log_entry)
                log_id = log_entry.id
            except Exception as db_err:
                print(f"[Email Service] Failed saving EmailLog to DB: {db_err}")

        return EmailDeliveryResult(
            success=(status == "SENT"),
            status=status,
            error=error_msg,
            log_id=log_id,
            provider_message_id=provider_id
        )

    # =========================================================================
    # WORKFLOW 1: AI INTERVIEW INVITATION (DOMAIN-SPECIFIC)
    # =========================================================================
    @classmethod
    async def send_ai_interview_invitation(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        interview_token: str,
        duration_minutes: int = 25,
        scheduled_ist: Optional[str] = None,
        candidate_id: Optional[int] = None,
        application_id: Optional[int] = None,
        job_department: Optional[str] = None
    ) -> EmailDeliveryResult:
        domain = resolve_domain_metadata(job_title, job_department)
        subject = f"FUTUREVERSE — [{domain['domain_name']} Track] AI Interview Invitation: {job_title}"
        interview_url = f"http://localhost:5173/interview/{interview_token}"
        ist_now = scheduled_ist or format_ist_datetime(now_ist())

        body = f"""
        <p>You have been officially invited to complete the adaptive proctored AI technical evaluation for <strong>{job_title}</strong> in the <strong>{domain['domain_name']}</strong> track at FUTUREVERSE.</p>
        
        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 22px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #38bdf8; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px;">Domain Track & Assessment Schedule:</p>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; line-height: 1.8; font-size: 13.5px;">
                <li><strong>Target Position:</strong> {job_title}</li>
                <li><strong>Domain Specialization:</strong> <span style="color: #38bdf8; font-weight: 700;">{domain['domain_name']}</span></li>
                <li><strong>Target Competencies:</strong> {domain['competencies']}</li>
                <li><strong>Assessment Focus:</strong> {domain['ai_assessment_focus']}</li>
                <li><strong>Scheduled Assessment Window:</strong> <span style="color: #f8fafc; font-weight: 600;">{ist_now}</span></li>
                <li><strong>Timezone:</strong> <span style="color: #38bdf8; font-weight: 600;">India Standard Time (IST, UTC+05:30)</span></li>
                <li><strong>Target Duration:</strong> {duration_minutes} Minutes</li>
                <li><strong>Proctoring Mode:</strong> Camera proctoring, live audio analysis, browser tab integrity monitoring</li>
            </ul>
        </div>

        <p style="font-weight: 600; color: #f8fafc; margin-top: 20px;">Domain Preparation & Guidelines:</p>
        <ol style="color: #cbd5e1; padding-left: 20px; line-height: 1.8; font-size: 13.5px;">
            <li>Use Google Chrome, Mozilla Firefox, or Microsoft Edge on a laptop or desktop computer.</li>
            <li>Be prepared to answer specialized reasoning questions tailored to {domain['domain_name']}.</li>
            <li>Ensure a functional webcam, microphone, and stable high-speed internet connection.</li>
            <li>Remain in full-screen mode throughout the session; window blur events are recorded.</li>
        </ol>

        <p>Click the secure button below when you are prepared to launch your authenticated assessment session:</p>
        """

        action = {"text": f"LAUNCH {domain['domain_badge'].split()[0]} ASSESSMENT", "url": interview_url}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=EmailType.AI_INTERVIEW_INVITATION.value,
            related_entity_id=interview_token,
            candidate_id=candidate_id,
            application_id=application_id,
            domain_badge=domain["domain_badge"]
        )

    # =========================================================================
    # WORKFLOW 2: FACE-TO-FACE (F2F) INTERVIEW INVITATION (DOMAIN-SPECIFIC)
    # =========================================================================
    @classmethod
    async def send_f2f_invitation(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        round_type: str,
        date_str: str,
        time_str: str,
        location_or_link: str,
        interviewer_name: str,
        instructions: Optional[str] = None,
        duration_minutes: int = 45,
        candidate_id: Optional[int] = None,
        application_id: Optional[int] = None,
        job_department: Optional[str] = None
    ) -> EmailDeliveryResult:
        domain = resolve_domain_metadata(job_title, job_department)
        subject = f"FUTUREVERSE — [{domain['domain_name']} Track] Face-to-Face Interview: {round_type} ({job_title})"
        portal_url = "http://localhost:5173/candidate/applications"

        instructions_block = (
            f"""<div style="background-color: #0f172a; padding: 14px 18px; border-radius: 6px; margin: 16px 0; border: 1px solid #334155; color: #cbd5e1; font-size: 13px;">
                <strong style="color: #38bdf8; display: block; margin-bottom: 4px;">Interviewer Instructions & Agenda:</strong>
                {instructions}
            </div>"""
            if instructions else ""
        )

        body = f"""
        <p>We are delighted to invite you to the <strong>Face-to-Face {round_type} Interview</strong> for <strong>{job_title}</strong> in the <strong>{domain['domain_name']}</strong> track at FUTUREVERSE.</p>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 22px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #38bdf8; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px;">Confirmed Interview Schedule:</p>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; line-height: 1.8; font-size: 13.5px;">
                <li><strong>Target Position:</strong> {job_title}</li>
                <li><strong>Domain Track:</strong> <span style="color: #38bdf8; font-weight: 700;">{domain['domain_name']}</span></li>
                <li><strong>Interview Round:</strong> Face-to-Face {round_type}</li>
                <li><strong>Domain Technical Focus:</strong> {domain['f2f_round_focus']}</li>
                <li><strong>Date:</strong> <span style="color: #f8fafc; font-weight: 600;">{date_str}</span></li>
                <li><strong>Time:</strong> <span style="color: #f8fafc; font-weight: 600;">{time_str}</span> (IST, UTC+05:30)</li>
                <li><strong>Lead Interviewer:</strong> {interviewer_name}</li>
                <li><strong>Expected Duration:</strong> {duration_minutes} Minutes</li>
                <li><strong>Meeting Link / Venue:</strong> <a href="{location_or_link}" style="color: #38bdf8; font-weight: 600; text-decoration: underline;">{location_or_link}</a></li>
            </ul>
        </div>

        {instructions_block}

        <p style="font-weight: 600; color: #f8fafc; margin-top: 20px;">Domain Preparation Checklist:</p>
        <ul style="color: #cbd5e1; padding-left: 20px; line-height: 1.8; font-size: 13.5px;">
            <li>Join the meeting link 5 minutes prior to the scheduled start time.</li>
            <li>Be prepared for in-depth whiteboard problem solving, code walkthroughs, and architecture decisions in {domain['domain_name']}.</li>
            <li>Have your valid government photo ID and resume available.</li>
        </ul>

        <p>You can track your interview progression and round schedule in your candidate portal:</p>
        """

        action = {"text": "VIEW INTERVIEW DETAILS IN PORTAL", "url": portal_url}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=EmailType.FACE_TO_FACE_INTERVIEW_INVITATION.value,
            related_entity_id=f"f2f-{application_id or ''}-{uuid.uuid4().hex[:6]}",
            candidate_id=candidate_id,
            application_id=application_id,
            domain_badge=domain["domain_badge"]
        )

    # =========================================================================
    # WORKFLOW 3: FINAL SELECTION / OFFER (DOMAIN-SPECIFIC)
    # =========================================================================
    @classmethod
    async def send_final_selection(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        application_id: Optional[int] = None,
        selection_date_ist: Optional[str] = None,
        notes: Optional[str] = None,
        candidate_id: Optional[int] = None,
        job_department: Optional[str] = None
    ) -> EmailDeliveryResult:
        domain = resolve_domain_metadata(job_title, job_department)
        subject = f"FUTUREVERSE — [{domain['domain_name']} Track] Congratulations! You Have Been Selected for {job_title}"
        ist_date = selection_date_ist or format_ist_datetime(now_ist())
        app_id_display = f"#{application_id}" if application_id else "VERIFIED-APP"

        notes_html = (
            f"""<div style="background-color: #064e3b; padding: 16px 20px; border-radius: 8px; margin: 22px 0; border: 1px solid #059669; color: #a7f3d0;">
                <strong style="display: block; margin-bottom: 6px; color: #6ee7b7; font-size: 12px; text-transform: uppercase;">Selection Committee & Recruiter Note:</strong>
                <p style="margin: 0; font-style: italic; font-size: 13.5px;">"{notes}"</p>
            </div>"""
            if notes else ""
        )

        body = f"""
        <div style="padding: 16px 20px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; margin-bottom: 24px;">
            <p style="font-size: 20px; font-weight: 800; color: #34d399; margin: 0 0 6px 0; letter-spacing: 0.5px;">Congratulations on Your Selection!</p>
            <p style="margin: 0; color: #e2e8f0; font-size: 14.5px;">
                We are thrilled to inform you that following your technical screening, proctored AI evaluation, and hiring committee assessments, you have been <strong>SELECTED</strong> for the position of <strong>{job_title}</strong> in the <strong>{domain['domain_name']}</strong> track at <strong>FUTUREVERSE</strong>.
            </p>
        </div>

        <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin: 22px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #38bdf8; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.8px;">Official Selection Dossier:</p>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; line-height: 1.8; font-size: 13.5px;">
                <li><strong>Company:</strong> FUTUREVERSE</li>
                <li><strong>Target Role:</strong> {job_title}</li>
                <li><strong>Engineering Cohort:</strong> <span style="color: #38bdf8; font-weight: 700;">{domain['offer_cohort']}</span></li>
                <li><strong>Application Reference:</strong> {app_id_display}</li>
                <li><strong>Selection Recorded:</strong> <span style="color: #f8fafc; font-weight: 600;">{ist_date}</span> (IST, UTC+05:30)</li>
                <li><strong>Final Status:</strong> <span style="color: #34d399; font-weight: 800;">OFFER EXTENDED</span></li>
            </ul>
        </div>

        {notes_html}

        <p style="font-weight: 700; color: #f8fafc; margin-top: 24px;">Immediate Next Steps:</p>
        <ol style="color: #cbd5e1; padding-left: 20px; line-height: 1.8; font-size: 13.5px;">
            <li><strong>Formal Compensation & Equity Package:</strong> Our Talent Operations team will transmit your comprehensive offer package, role milestones, and benefits within 1-2 business days.</li>
            <li><strong>Domain Tooling & Credentials:</strong> You will receive secure access credentials to your dedicated {domain['domain_name']} development environment and onboarding materials.</li>
            <li><strong>Welcome Briefing:</strong> An orientation briefing will be scheduled with your department engineering leadership.</li>
        </ol>

        <p>You can inspect your full application dossier, criteria scores, and onboarding progression in your candidate dashboard:</p>
        """

        action = {"text": "VIEW MY APPLICATION DOSSIER", "url": "http://localhost:5173/candidate/applications"}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=EmailType.FINAL_SELECTED.value,
            related_entity_id=str(application_id) if application_id else None,
            candidate_id=candidate_id,
            application_id=application_id,
            domain_badge=domain["domain_badge"]
        )

    # =========================================================================
    # WORKFLOW 4: FINAL NOT SELECTED / REJECTION (DOMAIN-SPECIFIC)
    # =========================================================================
    @classmethod
    async def send_final_rejection(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        application_id: Optional[int] = None,
        notes: Optional[str] = None,
        candidate_id: Optional[int] = None,
        job_department: Optional[str] = None
    ) -> EmailDeliveryResult:
        domain = resolve_domain_metadata(job_title, job_department)
        subject = f"FUTUREVERSE — [{domain['domain_name']} Track] Recruitment Process Update: {job_title}"

        notes_html = (
            f"""<div style="background-color: #1e293b; padding: 14px 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #475569; color: #cbd5e1; font-size: 13px;">
                <strong style="display: block; margin-bottom: 4px; color: #94a3b8; font-size: 11px; text-transform: uppercase;">Recruitment Committee Note:</strong>
                <p style="margin: 0; font-style: italic;">"{notes}"</p>
            </div>"""
            if notes else ""
        )

        body = f"""
        <p>Thank you very much for your interest in <strong>FUTUREVERSE</strong> and for the dedication, competence, and time you invested throughout our recruitment evaluation process for <strong>{job_title}</strong> in the <strong>{domain['domain_name']}</strong> track.</p>

        <p>We want to emphasize that your completed technical screening submissions, adaptive AI interviews, and domain evaluations were successfully recorded and verified. Our cognitive assessment engines confirmed your strong foundation in <strong>{domain['competencies']}</strong>.</p>

        <p>Due to the exceptionally competitive nature of our current cohort and the specific specialization thresholds required for this opening, our hiring committee has decided not to proceed further with your application for this specific role at this time.</p>

        {notes_html}

        <p style="font-weight: 600; color: #f8fafc; margin-top: 20px;">Your Profile Remains Verified in the {domain['domain_name']} Talent Graph:</p>
        <p>Your candidate profile, verified skill benchmarks, and evaluated interview performance remain securely archived in our global talent database. When new openings matching your competencies become available, our recruitment team actively references previously evaluated talent.</p>

        <p>We encourage you to explore other engineering positions on our careers portal:</p>
        """

        action = {"text": "EXPLORE FUTUREVERSE ROLES", "url": "http://localhost:5173/careers"}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=EmailType.FINAL_NOT_SELECTED.value,
            related_entity_id=str(application_id) if application_id else None,
            candidate_id=candidate_id,
            application_id=application_id,
            domain_badge=domain["domain_badge"]
        )

    # =========================================================================
    # WORKFLOW 5: SUPPORT TICKET REPLY
    # =========================================================================
    @classmethod
    async def send_support_reply(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        ticket_id: int,
        ticket_subject: str,
        reply_preview: str,
        candidate_id: Optional[int] = None
    ) -> EmailDeliveryResult:
        subject = f"FUTUREVERSE — Support Reply for Ticket #{ticket_id}: {ticket_subject}"
        support_url = f"http://localhost:5173/candidate/support?ticketId={ticket_id}"

        body = f"""
        <p>A member of the FUTUREVERSE Super Admin Support Team has posted an official reply to your support inquiry:</p>

        <div style="background-color: #1e293b; padding: 18px 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Ticket Reference:</p>
            <p style="margin: 0; color: #38bdf8; font-weight: 700; font-size: 15px;">#{ticket_id}: {ticket_subject}</p>
        </div>

        <div style="background-color: #0f172a; border-left: 4px solid #38bdf8; padding: 16px 20px; border-radius: 4px; margin: 20px 0; color: #f1f5f9; font-size: 14px; line-height: 1.6;">
            <strong style="color: #38bdf8; display: block; margin-bottom: 6px; font-size: 12px; text-transform: uppercase;">Support Agent Message:</strong>
            <p style="margin: 0; font-style: italic;">"{reply_preview}"</p>
        </div>

        <p>You can view the full conversation history, download attachments, and send follow-up replies directly in your candidate support portal:</p>
        """

        action = {"text": "OPEN SUPPORT CONVERSATION", "url": support_url}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=EmailType.SUPPORT_REPLY.value,
            related_entity_id=str(ticket_id),
            candidate_id=candidate_id,
            domain_badge="ENTERPRISE HELPDESK SUPPORT"
        )

    # =========================================================================
    # WORKFLOW 6: INTERVIEW REMINDER
    # =========================================================================
    @classmethod
    async def send_interview_reminder(
        cls,
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        interview_token: str,
        reminder_type: str = "24h",
        candidate_id: Optional[int] = None,
        application_id: Optional[int] = None,
        job_department: Optional[str] = None
    ) -> EmailDeliveryResult:
        domain = resolve_domain_metadata(job_title, job_department)
        time_text = "starts tomorrow" if reminder_type == "24h" else "starts in 1 hour"
        subject = f"FUTUREVERSE — [{domain['domain_name']} Track] Interview Reminder: Your AI Assessment {time_text}"
        interview_url = f"http://localhost:5173/interview/{interview_token}"

        body = f"""
        <p>This is a reminder that your proctored AI technical evaluation for <strong>{job_title}</strong> in the <strong>{domain['domain_name']}</strong> track {time_text}.</p>
        <p>Please ensure your webcam, microphone, and browser environment are tested beforehand for a seamless assessment experience.</p>
        """

        action = {"text": "ENTER AI INTERVIEW ROOM", "url": interview_url}
        return await cls.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=f"INTERVIEW_REMINDER_{reminder_type.upper()}",
            related_entity_id=interview_token,
            candidate_id=candidate_id,
            application_id=application_id,
            domain_badge=domain["domain_badge"]
        )

    # =========================================================================
    # RETRY LOGIC: Re-attempt a previously failed EmailLog
    # =========================================================================
    @classmethod
    async def retry_email_log(
        cls,
        db: AsyncSession,
        log_id: int
    ) -> EmailDeliveryResult:
        """Re-attempts dispatching an email from an existing EmailLog record using non-blocking threads."""
        result = await db.execute(select(EmailLog).filter(EmailLog.id == log_id))
        log_entry = result.scalars().first()
        if not log_entry:
            return EmailDeliveryResult(
                success=False,
                status="FAILED",
                error=f"Email log #{log_id} not found."
            )

        disp_result = await cls.send_email(
            to_email=log_entry.recipient,
            recipient_name="Applicant",
            subject=log_entry.subject,
            body_html=log_entry.content_html or f"<p>{log_entry.subject}</p>",
            db=None,
            email_type=log_entry.email_type,
            related_entity_id=log_entry.related_entity_id,
            candidate_id=log_entry.candidate_id,
            application_id=log_entry.application_id
        )

        log_entry.status = disp_result.status
        log_entry.error_message = disp_result.error
        log_entry.provider_message_id = disp_result.provider_message_id
        if disp_result.status == "SENT":
            log_entry.sent_at = datetime.utcnow()

        await db.commit()
        await db.refresh(log_entry)

        return EmailDeliveryResult(
            success=disp_result.success,
            status=disp_result.status,
            error=disp_result.error,
            log_id=log_entry.id,
            provider_message_id=disp_result.provider_message_id
        )
