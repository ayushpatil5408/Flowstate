/**
 * PriorityBadge component following design.md §5 semantic guidelines.
 * Displays both color accent and explicit textual label: High, Medium, Low.
 */
export default function PriorityBadge({ priority = "medium" }) {
  const normalized = String(priority).toLowerCase();
  const label =
    normalized === "high" ? "High" : normalized === "low" ? "Low" : "Medium";

  return (
    <span className={`priority-badge priority-${normalized}`}>
      <span className="priority-indicator" />
      {label}
    </span>
  );
}
