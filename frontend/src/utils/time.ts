export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Formats date and time string in Asia/Kolkata (IST) timezone.
 */
export function formatISTDateTime(
  dateInput: string | Date | number | null | undefined,
  includeSeconds = false
): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'N/A';

  const options: Intl.DateTimeFormatOptions = {
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  if (includeSeconds) {
    options.second = '2-digit';
  }

  return new Intl.DateTimeFormat('en-IN', options).format(date) + ' IST';
}

/**
 * Formats date string in Asia/Kolkata (IST).
 */
export function formatISTDate(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats time string in Asia/Kolkata (IST).
 */
export function formatISTTime(dateInput: string | Date | number | null | undefined): string {
  if (!dateInput) return 'N/A';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: DEFAULT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date) + ' IST';
}

/**
 * Returns current real-time data partitioned for live India clock widget.
 */
export function getLiveISTTime(now: Date = new Date()): {
  time: string;
  date: string;
  tz: string;
} {
  const timeFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: DEFAULT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: DEFAULT_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return {
    time: timeFormatter.format(now),
    date: dateFormatter.format(now),
    tz: 'IST · UTC+05:30',
  };
}
