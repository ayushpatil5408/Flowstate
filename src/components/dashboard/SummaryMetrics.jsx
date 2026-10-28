import { getTodayDateString } from "../../utils/dateUtils";

/**
 * SummaryMetrics component displaying dynamic counts derived strictly from
 * actual task and session records (PRD §7.7, design.md §10.1).
 */
export default function SummaryMetrics({ tasks = [], focusMinutes = 0 }) {
  const activeCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const today = getTodayDateString();
  const overdueCount = tasks.filter(
    (t) => !t.completed && t.dueAt && t.dueAt < today
  ).length;

  const dueTodayCount = tasks.filter(
    (t) => !t.completed && t.dueAt && t.dueAt === today
  ).length;

  return (
    <div className="summary-metrics-grid" role="region" aria-label="Productivity Summary">
      <div className="metric-card glass-panel">
        <div className="metric-icon active-icon">📋</div>
        <div className="metric-content">
          <span className="metric-value">{activeCount}</span>
          <span className="metric-label">Active Tasks</span>
        </div>
      </div>

      <div className="metric-card glass-panel">
        <div className="metric-icon due-icon">⏳</div>
        <div className="metric-content">
          <span className="metric-value">{dueTodayCount}</span>
          <span className="metric-label">Due Today</span>
        </div>
      </div>

      <div className={`metric-card glass-panel ${overdueCount > 0 ? "has-overdue" : ""}`}>
        <div className="metric-icon overdue-icon">⚠️</div>
        <div className="metric-content">
          <span className="metric-value">{overdueCount}</span>
          <span className="metric-label">Overdue</span>
        </div>
      </div>

      <div className="metric-card glass-panel">
        <div className="metric-icon focus-icon">⏱️</div>
        <div className="metric-content">
          <span className="metric-value">{focusMinutes}m</span>
          <span className="metric-label">Focus Time</span>
        </div>
      </div>

      <div className="metric-card glass-panel">
        <div className="metric-icon completed-icon">✓</div>
        <div className="metric-content">
          <span className="metric-value">{completedCount}</span>
          <span className="metric-label">Completed</span>
        </div>
      </div>
    </div>
  );
}
