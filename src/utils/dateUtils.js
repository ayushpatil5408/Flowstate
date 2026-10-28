/**
 * Timezone-safe date utilities for FLOWSTATE
 * Date-only deadlines are handled as 'YYYY-MM-DD' strings to prevent UTC midnight shifts.
 */

/**
 * Returns today's date formatted as YYYY-MM-DD in the user's local timezone.
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns tomorrow's date formatted as YYYY-MM-DD in the user's local timezone.
 */
export function getTomorrowDateString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Evaluates the deadline status of a task based on local calendar day.
 * Completed tasks are never labelled as overdue (PRD §7.5).
 *
 * @param {string|null} dueAt - 'YYYY-MM-DD' string or null
 * @param {boolean} completed - Task completion status
 * @returns {{ status: 'overdue'|'due-today'|'tomorrow'|'upcoming'|'none', label: string, isOverdue: boolean }}
 */
export function getDeadlineInfo(dueAt, completed = false) {
  if (!dueAt) {
    return { status: "none", label: "No deadline", isOverdue: false };
  }

  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  if (completed) {
    return {
      status: "completed",
      label: formatDisplayDate(dueAt),
      isOverdue: false,
    };
  }

  if (dueAt < today) {
    return {
      status: "overdue",
      label: "Overdue",
      isOverdue: true,
    };
  }

  if (dueAt === today) {
    return {
      status: "due-today",
      label: "Due today",
      isOverdue: false,
    };
  }

  if (dueAt === tomorrow) {
    return {
      status: "tomorrow",
      label: "Tomorrow",
      isOverdue: false,
    };
  }

  return {
    status: "upcoming",
    label: formatDisplayDate(dueAt),
    isOverdue: false,
  };
}

/**
 * Formats a YYYY-MM-DD string into a human-readable format like "Oct 28"
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats seconds into MM:SS format for focus timer
 */
export function formatTimer(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Returns contextual greeting based on current local hour
 */
export function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/**
 * Formats the current date for the dashboard header: e.g. "Tuesday, October 27"
 */
export function getFormattedCurrentDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
