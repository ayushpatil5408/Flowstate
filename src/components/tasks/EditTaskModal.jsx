import { useState, useEffect, useRef } from "react";

export default function EditTaskModal({ task, isOpen, onClose, onSave }) {
  if (!isOpen || !task) return null;

  return (
    <EditTaskDialogContent
      key={task.id}
      task={task}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function EditTaskDialogContent({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueAt, setDueAt] = useState(task.dueAt || "");
  const [error, setError] = useState("");
  const titleInputRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title cannot be empty.");
      titleInputRef.current?.focus();
      return;
    }

    onSave(task.id, {
      title: trimmedTitle,
      priority,
      dueAt: dueAt ? dueAt : null,
    });

    onClose();
  };

  const handleClearDeadline = () => {
    setDueAt("");
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-panel glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-task-modal-title"
      >
        <div className="modal-header">
          <h3 id="edit-task-modal-title" className="modal-title">
            Edit Task
          </h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {error && (
            <div
              id="edit-task-error"
              className="form-feedback error-feedback"
              role="alert"
            >
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-task-title-input" className="form-label">
              Task Title *
            </label>
            <input
              ref={titleInputRef}
              id="edit-task-title-input"
              type="text"
              autoFocus
              className={`task-input ${error ? "input-error" : ""}`}
              placeholder="e.g. Finish research paper chapter"
              value={title}
              aria-describedby={error ? "edit-task-error" : undefined}
              aria-invalid={!!error}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-task-priority-select" className="form-label">
                Priority
              </label>
              <select
                id="edit-task-priority-select"
                className="select-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="form-group">
              <div className="field-label-row">
                <label htmlFor="edit-task-due-input" className="form-label">
                  Deadline
                </label>
                {dueAt && (
                  <button
                    type="button"
                    className="clear-deadline-action"
                    onClick={handleClearDeadline}
                    title="Clear deadline date"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                id="edit-task-due-input"
                type="date"
                className="date-control"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="action-btn-quiet"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
