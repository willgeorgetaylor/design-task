import { DateTime } from "luxon";

/**
 * Formats the time span between two dates as a human-readable string.
 * Only returns hours or days, not weeks or longer periods.
 *
 * @param startIso - ISO string of the start time
 * @param endIso - ISO string of the end time (optional, defaults to now)
 * @param includeSuffix - Whether to include "ago" suffix (default: false)
 * @returns Formatted time span string like "2 hours" or "3 days ago"
 */
export function formatTimeSpent(
  startIso: string,
  endIso?: string,
  includeSuffix: boolean = false
): string {
  const start = DateTime.fromISO(startIso);
  const end = endIso ? DateTime.fromISO(endIso) : DateTime.now();

  const diffInHours = end.diff(start, "hours").hours;
  const diffInDays = end.diff(start, "days").days;

  let timeString: string;

  if (diffInHours < 24) {
    const hours = Math.round(diffInHours);
    timeString = `${hours} hour${hours !== 1 ? "s" : ""}`;
  } else {
    const days = Math.round(diffInDays);
    timeString = `${days} day${days !== 1 ? "s" : ""}`;
  }

  return includeSuffix ? `${timeString} ago` : timeString;
}
