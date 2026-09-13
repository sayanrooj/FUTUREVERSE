from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.audit import AuditLog
from backend.models.user import User

class AuditService:
    @staticmethod
    async def log_event(
        db: AsyncSession,
        action: str,
        user: Optional[User] = None,
        target_type: Optional[str] = None,
        target_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        ip_address: str = "127.0.0.1"
    ) -> AuditLog:
        """
        Records an auditable security or recruitment action to the database.
        """
        entry = AuditLog(
            user_id=user.id if user else None,
            user_role=user.role.value if user else "SYSTEM",
            user_email=user.email if user else "system@futureverse.ai",
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id else None,
            details=details or {},
            ip_address=ip_address
        )
        db.add(entry)
        await db.commit()
        await db.refresh(entry)
        return entry
