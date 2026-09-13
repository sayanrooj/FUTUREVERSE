from datetime import datetime, timezone, timedelta

# India Standard Time (IST, UTC+05:30)
IST_ZONE = timezone(timedelta(hours=5, minutes=30), name="IST")
UTC_ZONE = timezone.utc

def now_utc() -> datetime:
    """Returns current datetime in UTC."""
    return datetime.now(UTC_ZONE)

def now_ist() -> datetime:
    """Returns current datetime in Asia/Kolkata (IST)."""
    return datetime.now(IST_ZONE)

def to_ist(dt: datetime) -> datetime:
    """Converts a naive or aware UTC datetime to Asia/Kolkata (IST)."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        # Assume stored as UTC
        dt = dt.replace(tzinfo=UTC_ZONE)
    return dt.astimezone(IST_ZONE)

def format_ist_datetime(dt: datetime, fmt: str = "%d %B %Y, %I:%M %p IST") -> str:
    """Formats datetime as readable string in Asia/Kolkata (IST)."""
    if dt is None:
        return "N/A"
    ist_dt = to_ist(dt)
    return ist_dt.strftime(fmt)

def format_ist_date(dt: datetime, fmt: str = "%d %B %Y") -> str:
    """Formats date in Asia/Kolkata."""
    if dt is None:
        return "N/A"
    ist_dt = to_ist(dt)
    return ist_dt.strftime(fmt)

def format_ist_time(dt: datetime, fmt: str = "%I:%M %p IST") -> str:
    """Formats time in Asia/Kolkata."""
    if dt is None:
        return "N/A"
    ist_dt = to_ist(dt)
    return ist_dt.strftime(fmt)
