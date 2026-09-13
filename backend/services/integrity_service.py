from typing import Dict, Any, List
from datetime import datetime

class IntegrityService:
    @staticmethod
    def assess_event(
        event_type: str,
        existing_events_count: int,
        evidence: str
    ) -> Dict[str, Any]:
        """
        Processes an integrity monitoring signal responsibly.
        1st event -> Warning notice to candidate.
        Repeated events -> Flagged for recruiter review without premature automated rejection.
        Technical disconnects are segregated from compliance flags.
        """
        is_technical = "RECONNECT" in event_type.upper() or "DISCONNECT" in event_type.upper()
        
        if is_technical:
            return {
                "action": "GRACE_PERIOD_EXTENDED",
                "severity": "LOW",
                "warning_message": "Network or device reconnect detected. Your session state and answers are preserved.",
                "is_technical": True
            }

        new_count = existing_events_count + 1

        if new_count == 1:
            severity = "LOW"
            action = "WARN_CANDIDATE"
            warning_message = "Please remain on the interview screen. Continued interruptions or switching windows may affect interview integrity assessment."
        elif new_count in (2, 3):
            severity = "MEDIUM"
            action = "FLAG_FOR_REVIEW"
            warning_message = "Notice: Unfocused window activity detected. This session is being logged for human recruiter review."
        else:
            severity = "HIGH"
            action = "HIGH_RISK_FLAG"
            warning_message = "Repeated integrity signals recorded. A recruiter will inspect the session audit before final consideration."

        return {
            "action": action,
            "severity": severity,
            "warning_message": warning_message,
            "event_count": new_count,
            "is_technical": False
        }

    @staticmethod
    def summarize_integrity_report(events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Summarizes session integrity for recruiter review.
        """
        tech_events = [e for e in events if e.get("is_technical") or "RECONNECT" in e.get("event_type", "").upper()]
        behavioral_events = [e for e in events if e not in tech_events]

        event_count = len(behavioral_events)
        if event_count == 0:
            risk_level = "Clean / Verified"
        elif event_count <= 2:
            risk_level = "Low Risk (Minor interruptions)"
        elif event_count <= 4:
            risk_level = "Moderate Risk (Recruiter verification suggested)"
        else:
            risk_level = "Elevated Risk (Human review required)"

        return {
            "risk_level": risk_level,
            "total_behavioral_events": event_count,
            "total_technical_events": len(tech_events),
            "events": events,
            "human_verdict_required": event_count >= 3
        }
