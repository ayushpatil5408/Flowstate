import { getDeadlineInfo } from "../../utils/dateUtils";

/**
 * DeadlineLabel component following design.md §10.5.
 * Uses concise text labels and icons with semantic status classes.
 */
export default function DeadlineLabel({ dueAt, completed = false }) {
  const { status, label, isOverdue } = getDeadlineInfo(dueAt, completed);

  if (status === "none") {
    return (
      <span className="deadline-label deadline-none">
        <span className="deadline-icon">⚬</span>
        <span>No deadline</span>
      </span>
    );
  }

  const icon = isOverdue
    ? "⚠️"
    : status === "due-today"
    ? "⏳"
    : status === "tomorrow"
    ? "🕒"
    : "📅";

  return (
    <span className={`deadline-label deadline-${status}`}>
      <span className="deadline-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </span>
  );
}
