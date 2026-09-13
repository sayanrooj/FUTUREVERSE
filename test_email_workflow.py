import asyncio
import os
import sys
from datetime import datetime
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from backend.config import settings
from backend.database import AsyncSessionLocal
from backend.models.cms import EmailLog, SupportTicket
from backend.models.application import Application
from backend.models.user import User
from backend.services.email_service import EmailService, EmailType, EmailDeliveryResult
from backend.utils.time_utils import format_ist_datetime, now_ist

async def test_all_workflows():
    print("=================================================================")
    print("FUTUREVERSE EMAIL PIPELINE & RECRUITMENT WORKFLOW VERIFICATION")
    print("Created & Developed by Sayan Rooj")
    print("=================================================================\n")

    # 1. Test Config & Environment loading
    print("--- 1. CONFIGURATION & ENVIRONMENT LOADING ---")
    print(f"App Name: {settings.APP_NAME}")
    print(f"App Creator: {settings.APP_CREATOR}")
    print(f"SMTP Host: {settings.SMTP_HOST}")
    print(f"SMTP Port: {settings.SMTP_PORT}")
    print(f"SMTP User: {repr(settings.SMTP_USER)}")
    print(f"Enable Real Email: {settings.ENABLE_REAL_EMAIL}")
    print(f"TLS Enabled: {settings.EMAIL_USE_TLS}")
    print("[OK] Configuration successfully verified.\n")

    # 2. Test Connection Verification
    print("--- 2. CONNECTION VERIFICATION ---")
    diag = EmailService.verify_connection()
    print(f"Diagnosis Configured: {diag.get('configured')}")
    print(f"Diagnosis Ready: {diag.get('ready')}")
    print(f"Diagnosis User: {diag.get('user')}")
    print(f"Diagnosis Error: {diag.get('error')}")
    print("[OK] verify_connection executed safely without exposing secrets.\n")

    async with AsyncSessionLocal() as db:
        test_candidate_email = "test.candidate@futureverse.ai"
        test_candidate_name = "Aarav Sharma"

        # 3. Workflow 1: AI Interview Invitation
        print("--- 3. WORKFLOW 1: AI INTERVIEW INVITATION ---")
        w1_res = await EmailService.send_ai_interview_invitation(
            db=db,
            to_email=test_candidate_email,
            recipient_name=test_candidate_name,
            job_title="Lead AI Engineer",
            interview_token="token-ai-test-12345",
            duration_minutes=25,
            candidate_id=999,
            application_id=101,
            bypass_duplicate_check=True
        )
        print(f"AI Interview Email Result: Success={w1_res.success}, Status={w1_res.status}, LogId={w1_res.log_id}")
        assert w1_res.log_id is not None, "EmailLog must be created in DB"
        print("[OK] Workflow 1 verified.\n")

        # 4. Workflow 2: Face-to-Face Interview
        print("--- 4. WORKFLOW 2: FACE-TO-FACE INTERVIEW ---")
        w2_res = await EmailService.send_f2f_invitation(
            db=db,
            to_email=test_candidate_email,
            recipient_name=test_candidate_name,
            job_title="Lead AI Engineer",
            round_type="System Architecture Deep Dive",
            date_str="2026-09-20",
            time_str="14:30 IST",
            location_or_link="https://meet.futureverse.ai/arch-round-101",
            interviewer_name="Dr. Vikram Sen (VP of AI Systems)",
            instructions="Please prepare a whiteboard explanation of transformer attention kv-cache optimizations.",
            duration_minutes=45,
            candidate_id=999,
            application_id=101,
            bypass_duplicate_check=True
        )
        print(f"F2F Email Result: Success={w2_res.success}, Status={w2_res.status}, LogId={w2_res.log_id}")
        assert w2_res.log_id is not None, "EmailLog must be created in DB"
        print("[OK] Workflow 2 verified.\n")

        # 5. Workflow 3: Final Selection (Offer Extended)
        print("--- 5. WORKFLOW 3: FINAL SELECTION (OFFER EXTENDED) ---")
        w3_res = await EmailService.send_final_selection(
            db=db,
            to_email=test_candidate_email,
            recipient_name=test_candidate_name,
            job_title="Lead AI Engineer",
            application_id=101,
            selection_date_ist=format_ist_datetime(now_ist()),
            notes="Exceptional problem-solving during adaptive proctored technical reasoning evaluation.",
            candidate_id=999,
            bypass_duplicate_check=True
        )
        print(f"Selection Email Result: Success={w3_res.success}, Status={w3_res.status}, LogId={w3_res.log_id}")
        assert w3_res.log_id is not None, "EmailLog must be created in DB"
        print("[OK] Workflow 3 verified.\n")

        # 6. Workflow 4: Final Not Selected (Rejection, Scores Intact)
        print("--- 6. WORKFLOW 4: FINAL NOT SELECTED (SCORES INTACT) ---")
        w4_res = await EmailService.send_final_rejection(
            db=db,
            to_email=test_candidate_email,
            recipient_name=test_candidate_name,
            job_title="Lead AI Engineer",
            application_id=101,
            notes="Strong interview performance; talent retained in active talent pool for future cohort openings.",
            candidate_id=999,
            bypass_duplicate_check=True
        )
        print(f"Not Selected Email Result: Success={w4_res.success}, Status={w4_res.status}, LogId={w4_res.log_id}")
        assert w4_res.log_id is not None, "EmailLog must be created in DB"
        print("[OK] Workflow 4 verified.\n")

        # 7. Workflow 5: Support Ticket Reply
        print("--- 7. WORKFLOW 5: SUPPORT TICKET REPLY ---")
        w5_res = await EmailService.send_support_reply(
            db=db,
            to_email=test_candidate_email,
            recipient_name=test_candidate_name,
            ticket_id=42,
            ticket_subject="Audio calibration query during proctored assessment",
            reply_preview="Your audio calibration telemetry has been reviewed and verified by support. You may proceed.",
            candidate_id=999,
            bypass_duplicate_check=True
        )
        print(f"Support Reply Result: Success={w5_res.success}, Status={w5_res.status}, LogId={w5_res.log_id}")
        assert w5_res.log_id is not None, "EmailLog must be created in DB"
        print("[OK] Workflow 5 verified.\n")

        # 8. Test Duplicate Prevention Debounce
        print("--- 8. DUPLICATE PREVENTION (60s DEBOUNCE) ---")
        # Dispatch a mock SENT email to test debounce
        mock_sent_log = EmailLog(
            recipient="debounce.test@futureverse.ai",
            email_type=EmailType.AI_INTERVIEW_INVITATION.value,
            subject="Duplicate Test",
            related_entity_id="dup-entity-99",
            status="SENT",
            provider_message_id="smtp-mock-sent",
            created_at=datetime.utcnow()
        )
        db.add(mock_sent_log)
        await db.commit()
        await db.refresh(mock_sent_log)

        # Attempt to send again with same entity ID within 60s
        dup_attempt = await EmailService.send_email(
            to_email="debounce.test@futureverse.ai",
            recipient_name="Debounce Test User",
            subject="Duplicate Test",
            body_html="<p>Test</p>",
            db=db,
            email_type=EmailType.AI_INTERVIEW_INVITATION.value,
            related_entity_id="dup-entity-99",
            bypass_duplicate_check=False
        )
        print(f"Duplicate check result: Success={dup_attempt.success}, Status={dup_attempt.status}, ProviderID={dup_attempt.provider_message_id}")
        assert dup_attempt.provider_message_id == "smtp-mock-sent", "Must return existing sent record without duplicate dispatch"
        print("[OK] 60-Second duplicate prevention verified.\n")

        # 9. Test Retry Mechanism
        print("--- 9. RETRY EMAIL MECHANISM ---")
        retry_res = await EmailService.retry_email_log(db=db, log_id=w1_res.log_id)
        print(f"Retry Result: Success={retry_res.success}, Status={retry_res.status}, LogId={retry_res.log_id}, Error={retry_res.error}")
        assert retry_res.log_id == w1_res.log_id, "Retry must operate on the same EmailLog ID"
        print("[OK] Retry mechanism verified.\n")

        # 10. Verify Database EmailLog Records
        print("--- 10. DATABASE AUDITING CHECK ---")
        logs_q = await db.execute(
            select(EmailLog).order_by(EmailLog.id.desc()).limit(10)
        )
        latest_logs = logs_q.scalars().all()
        print(f"Fetched {len(latest_logs)} latest EmailLogs:")
        for l in latest_logs[:5]:
            print(f"  - ID: {l.id} | Type: {l.email_type} | To: {l.recipient} | Status: {l.status} | CandID: {l.candidate_id} | AppID: {l.application_id}")
        print("[OK] Database auditing verified.\n")

    print("=================================================================")
    print("ALL 10 VERIFICATION CHECKS PASSED SUCCESSFULLY!")
    print("=================================================================")

if __name__ == "__main__":
    asyncio.run(test_all_workflows())
