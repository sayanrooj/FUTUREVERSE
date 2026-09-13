from typing import Dict, Any, Optional
from datetime import datetime

class ApplicationStatusService:
    """
    Authoritative Application Status & Final Decision Resolver
    FUTUREVERSE Platform | Created & Developed by Sayan Rooj

    Rules:
    1. Recruiter/Admin Final Decision is strictly authoritative over interview outcomes.
    2. If final_decision == 'SELECTED' -> candidate sees 'SELECTED'.
    3. If final_decision == 'NOT_SELECTED' -> candidate sees 'NOT SELECTED'.
    4. If final_decision == 'ON_HOLD' -> candidate sees 'ON HOLD'.
    5. Only when final_decision is None does the system display the ongoing interview/application pipeline stage.
    6. Completed interview results, evaluations, and scores are ALWAYS preserved without modification.
    """

    @staticmethod
    def resolve_status(application: Any) -> Dict[str, Any]:
        """
        Computes a consistent, transparent status breakdown for an application.
        Accepts an Application model or dictionary.
        """
        # Extract attributes whether ORM or dict
        if isinstance(application, dict):
            status = application.get("status", "Applied")
            final_decision = application.get("final_decision")
            final_decision_at = application.get("final_decision_at")
            final_decision_by = application.get("final_decision_by")
            final_decision_notes = application.get("final_decision_notes")
            interview = application.get("interview")
            f2f = application.get("f2f_schedule")
            scores = application.get("scores")
        else:
            status = getattr(application, "status", "Applied")
            final_decision = getattr(application, "final_decision", None)
            final_decision_at = getattr(application, "final_decision_at", None)
            final_decision_by = getattr(application, "final_decision_by", None)
            final_decision_notes = getattr(application, "final_decision_notes", None)
            try:
                interview = getattr(application, "interview", None)
            except Exception:
                interview = None
            try:
                f2f = getattr(application, "f2f_schedule", None)
            except Exception:
                f2f = None
            try:
                scores = getattr(application, "scores", None)
            except Exception:
                scores = None

        # 1. Interview Evaluation Breakdown
        interview_status = "Not Scheduled"
        interview_score = None
        interview_passed = None
        interview_summary = None

        if interview:
            if isinstance(interview, dict):
                interview_status = interview.get("status", "Scheduled")
                res = interview.get("result")
                if res:
                    interview_score = res.get("overall_performance")
                    interview_summary = res.get("summary")
            else:
                interview_status = getattr(interview, "status", "Scheduled")
                try:
                    res = getattr(interview, "result", None)
                except Exception:
                    res = None
                if res:
                    try:
                        interview_score = getattr(res, "overall_performance", None)
                        interview_summary = getattr(res, "interview_summary", None)
                    except Exception:
                        pass

            # Determine pass/fail benchmark (>= 65% is pass)
            if interview_score is not None:
                try:
                    score_val = float(str(interview_score).replace("%", ""))
                    interview_passed = score_val >= 65.0
                except (ValueError, TypeError):
                    interview_passed = True
            elif interview_status == "Completed":
                interview_passed = True

        # 2. Pipeline Stage
        stage_name = status
        if status in ("Offer Extended", "Not Selected"):
            stage_name = "Final Decision"
        elif f2f:
            stage_name = "Face-to-Face Scheduled"
        elif interview and interview_status == "Completed":
            stage_name = "AI Interview Completed"
        elif interview:
            stage_name = "AI Interview Invited"

        # 3. Determine Candidate-Facing Status (Strict Priority Rule)
        candidate_facing_status = stage_name
        status_theme = "info" # info, success, danger, warning

        if final_decision == "SELECTED" or status == "Offer Extended":
            candidate_facing_status = "SELECTED"
            status_theme = "success"
            decision_label = "Offer Extended • Congratulations"
        elif final_decision == "NOT_SELECTED" or status == "Not Selected":
            candidate_facing_status = "NOT SELECTED"
            status_theme = "danger"
            decision_label = "Application Not Proceeding"
        elif final_decision == "ON_HOLD":
            candidate_facing_status = "ON HOLD"
            status_theme = "warning"
            decision_label = "Application On Hold for Further Review"
        else:
            decision_label = "Decision Pending Review"
            if stage_name == "AI Interview Completed":
                status_theme = "info"
            elif stage_name == "Face-to-Face Scheduled":
                status_theme = "info"

        return {
            "application_stage": stage_name,
            "raw_status": status,
            "final_decision": final_decision,
            "final_decision_at": final_decision_at.isoformat() if isinstance(final_decision_at, datetime) else final_decision_at,
            "final_decision_by": final_decision_by,
            "final_decision_notes": final_decision_notes,
            "candidate_facing_status": candidate_facing_status,
            "decision_label": decision_label,
            "status_theme": status_theme,
            "is_terminal": final_decision in ("SELECTED", "NOT_SELECTED") or status in ("Offer Extended", "Not Selected"),
            "interview_breakdown": {
                "has_interview": interview is not None,
                "status": interview_status,
                "is_completed": interview_status == "Completed",
                "score": interview_score,
                "passed": interview_passed,
                "summary": interview_summary
            },
            "f2f_breakdown": {
                "has_f2f": f2f is not None,
                "is_confirmed": f2f is not None
            }
        }
