import PriorityBadge from "../common/PriorityBadge";
import DeadlineLabel from "../common/DeadlineLabel";

export default function TaskItem({
  task,
  onToggleComplete,
  onSelectFocus,
  onDelete,
  onEdit,
}) {
  return (
    <div
      className={`task-item glass-panel ${task.completed ? "task-completed" : ""}`}
      role="listitem"
    >
      <label className="task-checkbox-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          aria-label={`Mark "${task.title}" as ${task.completed ? "active" : "completed"}`}
        />
        <span className="checkbox-custom" />
      </label>

      <div className="task-body">
        <div className="task-header-row">
          <span className="task-title">{task.title}</span>
          {task.isSample && (
            <span className="sample-tag" title="Demonstration task">
              Sample
            </span>
          )}
        </div>

        <div className="task-meta-row">
          <PriorityBadge priority={task.priority} />
          <DeadlineLabel dueAt={task.dueAt} completed={task.completed} />
        </div>
      </div>

      <div className="task-actions">
        {onEdit && (
          <button
            type="button"
            className="action-btn-quiet edit-action-btn"
            title={`Edit task: ${task.title}`}
            onClick={() => onEdit(task)}
            aria-label={`Edit task: ${task.title}`}
          >
            <span>✏️ Edit</span>
          </button>
        )}

        {!task.completed && onSelectFocus && (
          <button
            type="button"
            className="action-btn-quiet focus-action-btn"
            title="Select this task for Focus timer"
            onClick={() => onSelectFocus(task)}
          >
            <span>🎯 Focus</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="action-btn-quiet delete-action-btn"
            title="Delete task"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
          >
            <span>🗑️</span>
          </button>
        )}
      </div>
    </div>
  );
}
