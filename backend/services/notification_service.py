import smtplib
import uuid
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.config import settings
from backend.models.cms import Notification, EmailLog
from backend.utils.time_utils import format_ist_datetime, format_ist_date, now_ist

class EmailDeliveryResult:
    """Encapsulates transactional email dispatch outcome with boolean truthiness and telemetry."""
    def __init__(self, success: bool, status: str, error: Optional[str] = None, log_id: Optional[int] = None):
        self.success = success
        self.status = status
        self.error = error
        self.log_id = log_id

    def __bool__(self):
        return self.success

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "status": self.status,
            "error": self.error,
            "log_id": self.log_id
        }

    def __getitem__(self, item):
        return self.to_dict()[item]

class NotificationService:
    """
    FUTUREVERSE Enterprise Notification & Communications Engine
    Created & Developed by Sayan Rooj
    Supports In-App Real-time Notifications, SMTP/Gmail Dispatch, and Email Delivery Auditing.
    """

    @staticmethod
    def get_email_template(title: str, recipient_name: str, body_html: str, action_button: Optional[dict] = None) -> str:
        btn_html = ""
        if action_button:
            btn_html = f"""
            <div style="margin: 32px 0; text-align: center;">
                <a href="{action_button.get('url', '#')}" style="background: linear-gradient(135deg, #0ea5e9, #6366f1); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);">
                    {action_button.get('text', 'View in FUTUREVERSE')}
                </a>
            </div>
            """

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{title}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
            <div style="max-width: 600px; margin: 40px auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
                <div style="background: linear-gradient(135deg, #1e293b, #0f172a); padding: 24px; border-bottom: 1px solid #1f2937; text-align: center;">
                    <h1 style="margin: 0; color: #38bdf8; font-size: 24px; letter-spacing: 2px;">FUTUREVERSE</h1>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">Intelligent Recruitment Platform</p>
                </div>
                <div style="padding: 32px 24px; line-height: 1.6; color: #cbd5e1;">
                    <p style="font-size: 16px; margin-top: 0; color: #f8fafc;">Hello <strong>{recipient_name}</strong>,</p>
                    {body_html}
                    {btn_html}
                    <p style="margin-top: 28px; font-size: 13px; color: #94a3b8; border-top: 1px solid #1f2937; padding-top: 16px;">
                        Warm regards,<br>
                        <strong style="color: #f1f5f9;">FUTUREVERSE Talent & Recruitment Advisory Team</strong>
                    </p>
                </div>
                <div style="background-color: #0a0e17; padding: 18px 24px; text-align: center; border-top: 1px solid #1f2937; font-size: 11px; color: #64748b;">
                    <p style="margin: 0;">FUTUREVERSE © 2026 | Designed & Developed by Sayan Rooj</p>
                    <p style="margin: 4px 0 0 0;">This is an automated recruitment communication. Replies to this email address are monitored.</p>
                </div>
            </div>
        </body>
        </html>
        """

    @staticmethod
    async def send_email(
        to_email: str,
        recipient_name: str,
        subject: str,
        body_html: str,
        action_button: Optional[dict] = None,
        db: Optional[AsyncSession] = None,
        email_type: str = "TRANSACTIONAL",
        related_entity_id: Optional[str] = None
    ) -> EmailDeliveryResult:
        """
        Validates email format, checks SMTP configuration, and dispatches email.
        If SMTP is unconfigured or credentials are missing/dummy, accurately records status as 'FAILED'
        with clear error reasoning, rather than falsely declaring delivery success.
        """
        html_content = NotificationService.get_email_template(subject, recipient_name, body_html, action_button)
        status = "FAILED"
        error_msg = None
        provider_id = None

        # 1. Recipient Email Validation
        if not to_email or "@" not in to_email or "." not in to_email.split("@")[-1]:
            status = "FAILED"
            error_msg = f"Invalid email format: '{to_email}'"
            print(f"[Email Service] Validation failure: {error_msg}")
        elif settings.ENABLE_REAL_EMAIL and settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = settings.EMAIL_FROM
                msg["To"] = to_email
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
                    if settings.EMAIL_USE_TLS:
                        server.starttls()
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    server.sendmail(settings.EMAIL_FROM, to_email, msg.as_string())
                provider_id = f"smtp-{uuid.uuid4().hex[:12]}"
                status = "SENT"
                error_msg = None
            except Exception as e:
                status = "FAILED"
                error_msg = f"SMTP dispatch error: {str(e)}"
                print(f"[Email Service] SMTP dispatch error: {e}")
        else:
            # SMTP is not configured or ENABLE_REAL_EMAIL is False
            status = "FAILED"
            error_msg = "SMTP unconfigured: EMAIL_USERNAME and EMAIL_PASSWORD are not configured in system environment."
            provider_id = f"smtp-unconfigured-{uuid.uuid4().hex[:8]}"
            print(f"[Email Service] Delivery status marked FAILED for {to_email}: {error_msg}")

        # Save to EmailLog in DB if session available
        log_id = None
        if db:
            try:
                log_entry = EmailLog(
                    recipient=to_email,
                    email_type=email_type,
                    subject=subject,
                    related_entity_id=related_entity_id,
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
                print(f"[Email Service] Failed saving EmailLog: {db_err}")

        return EmailDeliveryResult(
            success=(status == "SENT"),
            status=status,
            error=error_msg,
            log_id=log_id
        )

    # --- SPECIFIC TRANSACTIONAL EMAIL DISPATCHERS ---

    @staticmethod
    async def send_interview_invitation(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        interview_token: str,
        duration_minutes: int = 25,
        scheduled_ist: Optional[str] = None
    ) -> EmailDeliveryResult:
        subject = f"FUTUREVERSE — AI Interview Invitation for {job_title}"
        interview_url = f"http://localhost:5173/interview/{interview_token}"
        ist_now_formatted = scheduled_ist or format_ist_datetime(now_ist())
        body = f"""
        <p>You have been invited to complete the adaptive proctored AI interview for the position of <strong>{job_title}</strong> at FUTUREVERSE.</p>
        <div style="background-color: #1e293b; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #38bdf8; font-weight: 600;">Assessment Schedule & Environment Details:</p>
            <ul style="margin: 0; padding-left: 20px; color: #94a3b8; line-height: 1.8;">
                <li><strong>Position:</strong> {job_title}</li>
                <li><strong>Interview Type:</strong> Adaptive Proctored Technical & Reasoning Assessment</li>
                <li><strong>Evaluation Window Starts:</strong> <span style="color: #f8fafc; font-weight: 600;">{ist_now_formatted}</span></li>
                <li><strong>Timezone:</strong> <span style="color: #38bdf8; font-weight: 600;">India Standard Time (IST, UTC+05:30)</span></li>
                <li><strong>Estimated Duration:</strong> {duration_minutes} minutes</li>
                <li><strong>Proctoring Mode:</strong> Voice / Text with real-time camera and audio integrity telemetry</li>
            </ul>
        </div>
        <p><strong>Required Preparation & Conduct Guidelines:</strong></p>
        <ol style="color: #94a3b8; padding-left: 20px; line-height: 1.8;">
            <li>Use a desktop or laptop computer running Google Chrome, Microsoft Edge, or Firefox.</li>
            <li>Ensure a stable, high-speed internet connection and verified functioning webcam and microphone.</li>
            <li>Remain in the full-screen browser assessment window throughout; tab switches and blur events are audited.</li>
            <li>Complete the evaluation independently in a quiet, well-lit private space.</li>
        </ol>
        <p>Click the secure button below to enter your authenticated interview room when you are prepared:</p>
        """
        action = {"text": "LAUNCH AI INTERVIEW ROOM", "url": interview_url}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="INTERVIEW_INVITATION",
            related_entity_id=interview_token
        )

    @staticmethod
    async def send_interview_reminder(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        interview_token: str,
        reminder_type: str = "24h"
    ) -> EmailDeliveryResult:
        """Sends duplicate-prevented interview reminders"""
        # Check if already sent
        res = await db.execute(
            select(EmailLog).filter(
                EmailLog.recipient == to_email,
                EmailLog.email_type == f"INTERVIEW_REMINDER_{reminder_type.upper()}",
                EmailLog.related_entity_id == interview_token,
                EmailLog.status == "SENT"
            )
        )
        if res.scalars().first():
            return EmailDeliveryResult(success=True, status="SENT", error=None)  # Already sent, prevent duplicate

        time_text = "starts tomorrow" if reminder_type == "24h" else "starts in 1 hour"
        subject = f"FUTUREVERSE — Interview Reminder: Your AI Interview {time_text}"
        interview_url = f"http://localhost:5173/interview/{interview_token}"
        body = f"""
        <p>This is a friendly reminder that your proctored AI interview for <strong>{job_title}</strong> {time_text}.</p>
        <p>Please test your camera, microphone, and browser environment beforehand to ensure a seamless evaluation.</p>
        """
        action = {"text": "Enter Interview Room", "url": interview_url}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type=f"INTERVIEW_REMINDER_{reminder_type.upper()}",
            related_entity_id=interview_token
        )

    @staticmethod
    async def send_interview_completed(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        score: float
    ) -> EmailDeliveryResult:
        subject = f"FUTUREVERSE — Interview Completed: {job_title}"
        body = f"""
        <p>Thank you for completing your proctored AI interview for <strong>{job_title}</strong>.</p>
        <p>Our cognitive evaluation engine recorded an overall interview performance of <strong>{score:.1f}%</strong>.</p>
        <p>Our recruitment panel is currently reviewing your complete dossier and interview telemetry. You can track your real-time application progression directly from your dashboard.</p>
        """
        action = {"text": "View Application Dashboard", "url": "http://localhost:5173/candidate/applications"}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="INTERVIEW_COMPLETED"
        )

    @staticmethod
    async def send_final_selection(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        application_id: Optional[int] = None,
        selection_date_ist: Optional[str] = None,
        notes: Optional[str] = None
    ) -> EmailDeliveryResult:
        subject = f"FUTUREVERSE — Congratulations! You Have Been Selected for {job_title}"
        ist_date = selection_date_ist or format_ist_datetime(now_ist())
        app_id_display = f"#{application_id}" if application_id else "VERIFIED-RECORD"
        notes_html = (
            f"""<div style="background-color: #064e3b; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #059669; color: #a7f3d0;">
                <strong style="display: block; margin-bottom: 6px; color: #6ee7b7;">Recruiter & Selection Committee Note:</strong>
                <p style="margin: 0; font-style: italic;">"{notes}"</p>
            </div>"""
            if notes else ""
        )
        body = f"""
        <div style="padding: 12px 18px; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 20px; font-weight: 700; color: #34d399; margin: 0 0 6px 0;">Congratulations on Your Selection!</p>
            <p style="margin: 0; color: #e2e8f0; font-size: 14px;">We are thrilled to officially inform you that following your rigorous technical screening, proctored AI evaluation, and hiring committee review, you are <strong>SELECTED</strong> for the position of <strong>{job_title}</strong> at <strong>FUTUREVERSE</strong>.</p>
        </div>

        <div style="background-color: #1e293b; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #334155;">
            <p style="margin: 0 0 10px 0; color: #38bdf8; font-weight: 600;">Official Selection Dossier:</p>
            <ul style="margin: 0; padding-left: 20px; color: #94a3b8; line-height: 1.8;">
                <li><strong>Company:</strong> FUTUREVERSE</li>
                <li><strong>Target Position:</strong> {job_title}</li>
                <li><strong>Application ID:</strong> {app_id_display}</li>
                <li><strong>Selection Decision Recorded:</strong> <span style="color: #f8fafc; font-weight: 600;">{ist_date}</span></li>
                <li><strong>Timezone:</strong> India Standard Time (IST, UTC+05:30)</li>
                <li><strong>Decision Status:</strong> <span style="color: #34d399; font-weight: 700;">OFFER EXTENDED</span></li>
            </ul>
        </div>

        {notes_html}

        <p style="font-weight: 600; color: #f8fafc; margin-top: 24px;">Immediate Next Steps:</p>
        <ol style="color: #cbd5e1; padding-left: 20px; line-height: 1.8;">
            <li><strong>Official Offer Package:</strong> Our Talent Operations team will transmit your comprehensive offer letter, role milestones, and benefits package within 1-2 business days.</li>
            <li><strong>Pre-Onboarding Documentation:</strong> You will receive a secure credential link to verify identity, academic certificates, and work authorizations.</li>
            <li><strong>Executive Welcome Briefing:</strong> A 30-minute orientation session will be scheduled with your department engineering lead.</li>
        </ol>
        <p>You can inspect your full application dossier, criteria scores, and real-time onboarding status directly in your candidate portal:</p>
        """
        action = {"text": "VIEW MY FUTUREVERSE APPLICATION", "url": "http://localhost:5173/candidate/applications"}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="FINAL_DECISION_SELECTED",
            related_entity_id=str(application_id) if application_id else None
        )

    @staticmethod
    async def send_final_rejection(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        job_title: str,
        application_id: Optional[int] = None,
        notes: Optional[str] = None
    ) -> EmailDeliveryResult:
        subject = f"FUTUREVERSE — Recruitment Process Update for {job_title}"
        notes_html = (
            f"""<div style="background-color: #1e293b; padding: 14px; border-radius: 8px; margin: 20px 0; border: 1px solid #475569; color: #cbd5e1;">
                <strong style="display: block; margin-bottom: 4px; color: #94a3b8; font-size: 11px; text-transform: uppercase;">Recruitment Committee Note:</strong>
                <p style="margin: 0; font-style: italic;">"{notes}"</p>
            </div>"""
            if notes else ""
        )
        body = f"""
        <p>Thank you very much for your interest in <strong>FUTUREVERSE</strong> and for the dedication, competence, and time you invested throughout our recruitment evaluation process for the <strong>{job_title}</strong> position.</p>

        <p>We want to emphasize that your completed technical screening submissions, adaptive AI interviews, and domain evaluations were successfully recorded and verified. Our cognitive assessment engines confirmed your strong foundation and valuable engineering potential.</p>

        <p>Due to the exceptionally competitive nature of our current cohort and the specific specialization thresholds required for this particular opening, our hiring committee has decided not to proceed further with your application for this specific role at this time.</p>

        {notes_html}

        <p><strong>Your Profile Remains Verified in FUTUREVERSE:</strong></p>
        <p>Your candidate profile, verified skill benchmarks, and evaluated interview performance remain securely archived in our global talent graph. When new roles matching your core competencies become available, our recruitment team actively references previously evaluated talent.</p>

        <p>We encourage you to monitor our careers portal and apply for upcoming engineering opportunities that align with your career ambitions.</p>
        """
        action = {"text": "EXPLORE FUTUREVERSE ROLES", "url": "http://localhost:5173/careers"}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="FINAL_DECISION_NOT_SELECTED",
            related_entity_id=str(application_id) if application_id else None
        )

    @staticmethod
    async def send_support_ticket_received(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        ticket_id: int,
        ticket_subject: str
    ) -> bool:
        subject = f"FUTUREVERSE — Support Ticket #{ticket_id} Received"
        body = f"""
        <p>Your support ticket has been received and assigned to our Helpdesk team.</p>
        <p><strong>Ticket ID:</strong> #{ticket_id}<br/><strong>Subject:</strong> {ticket_subject}</p>
        <p>A member of our support team will reply directly to your ticket in your candidate dashboard.</p>
        """
        action = {"text": "View Support Conversation", "url": "http://localhost:5173/candidate/support"}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="SUPPORT_TICKET_CREATED",
            related_entity_id=str(ticket_id)
        )

    @staticmethod
    async def send_support_ticket_reply(
        db: AsyncSession,
        to_email: str,
        recipient_name: str,
        ticket_id: int,
        ticket_subject: str,
        reply_preview: str
    ) -> bool:
        subject = f"FUTUREVERSE — New Support Reply for Ticket #{ticket_id}"
        body = f"""
        <p>Our support team has posted a reply to your ticket <strong>#{ticket_id}: {ticket_subject}</strong>:</p>
        <div style="background-color: #1e293b; border-left: 4px solid #38bdf8; padding: 14px; border-radius: 4px; margin: 16px 0; color: #f1f5f9; font-style: italic;">
            "{reply_preview}"
        </div>
        <p>You can read the full message thread and reply back in your Support Conversation dashboard.</p>
        """
        action = {"text": "Open Support Conversation", "url": "http://localhost:5173/candidate/support"}
        return await NotificationService.send_email(
            to_email=to_email,
            recipient_name=recipient_name,
            subject=subject,
            body_html=body,
            action_button=action,
            db=db,
            email_type="SUPPORT_TICKET_REPLIED",
            related_entity_id=str(ticket_id)
        )

    # --- IN-APP NOTIFICATION BUILDER ---

    @staticmethod
    async def create_notification(
        db: AsyncSession,
        user_id: int,
        title: str,
        message: str,
        notif_type: str = "INFO",
        link: Optional[str] = None
    ) -> Notification:
        """Creates an in-app notification item"""
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            link=link
        )
        db.add(notif)
        await db.commit()
        await db.refresh(notif)
        return notif
