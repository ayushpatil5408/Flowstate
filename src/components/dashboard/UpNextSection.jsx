import TaskItem from "../tasks/TaskItem";
import { getTodayDateString } from "../../utils/dateUtils";

export default function UpNextSection({
  tasks = [],
  onToggleComplete,
  onSelectFocus,
  onDelete,
  onEditTask,
  onViewAllTasks,
}) {
  const today = getTodayDateString();

  // Active tasks sorted by urgency and priority (PRD §7.4)
  const activeTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      // 1. Overdue/due-today first
      const aUrgent = a.dueAt && a.dueAt <= today ? 1 : 0;
      const bUrgent = b.dueAt && b.dueAt <= today ? 1 : 0;
      if (aUrgent !== bUrgent) return bUrgent - aUrgent;

      // 2. Priority: High (3) -> Medium (2) -> Low (1)
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aWeight = priorityWeight[a.priority] || 2;
      const bWeight = priorityWeight[b.priority] || 2;
      if (aWeight !== bWeight) return bWeight - aWeight;

      // 3. Due date ascending (earlier due dates first)
      if (a.dueAt && b.dueAt) return a.dueAt.localeCompare(b.dueAt);
      if (a.dueAt && !b.dueAt) return -1;
      if (!a.dueAt && b.dueAt) return 1;

      // 4. Recently created
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const previewTasks = activeTasks.slice(0, 5);

  return (
    <section className="up-next-section" aria-labelledby="up-next-heading">
      <div className="section-header">
        <div>
          <h2 id="up-next-heading" className="section-title">
            Up Next
          </h2>
          <p className="section-subtitle">
            Prioritized actions for today
          </p>
        </div>

        {activeTasks.length > 5 && (
          <button
            type="button"
            className="action-btn-quiet"
            onClick={onViewAllTasks}
          >
            View all ({activeTasks.length}) →
          </button>
        )}
      </div>

      {previewTasks.length === 0 ? (
        <div className="empty-state glass-panel">
          <span className="empty-icon">✨</span>
          <p className="empty-title">You're in complete flow!</p>
          <p className="empty-subtitle">
            No pending tasks. Capture a new thought or enjoy the calm space.
          </p>
        </div>
      ) : (
        <div className="tasks-list" role="list">
          {previewTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onSelectFocus={onSelectFocus}
              onDelete={onDelete}
              onEdit={onEditTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}
