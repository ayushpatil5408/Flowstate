import { useState } from "react";

export default function QuickCapture({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      setError("Please enter a task title.");
      return;
    }

    if (trimmed.length > 200) {
      setError("Task title must be under 200 characters.");
      return;
    }

    setError("");
    onAddTask({
      title: trimmed,
      priority,
      dueAt: dueAt || null,
      completed: false,
    });

    setTitle("");
    setDueAt("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <section className="quick-capture-panel glass-panel" aria-labelledby="quick-capture-heading">
      <div className="panel-header">
        <h2 id="quick-capture-heading" className="panel-title">
          <span className="panel-icon">⚡</span> Quick Capture
        </h2>
        <span className="panel-hint">Press Enter to add</span>
      </div>

      <form onSubmit={handleSubmit} className="quick-capture-form">
        <div className="input-group">
          <input
            type="text"
            className={`task-input ${error ? "input-error" : ""}`}
            placeholder="What do you need to get done?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError("");
            }}
            aria-label="New task title"
          />

          <div className="capture-controls">
            <div className="control-field">
              <label htmlFor="capture-priority" className="visually-hidden">
                Priority
              </label>
              <select
                id="capture-priority"
                className="select-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div className="control-field">
              <label htmlFor="capture-deadline" className="visually-hidden">
                Due Date
              </label>
              <input
                id="capture-deadline"
                type="date"
                className="date-control"
                value={dueAt}
                onChange={(e) => setDueAt(e.target.value)}
                title="Due date (optional)"
              />
            </div>

            <button type="submit" className="primary-btn add-btn">
              <span>+ Add Task</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="form-feedback error-feedback" role="alert">
            {error}
          </div>
        )}

        {isSuccess && (
          <div className="form-feedback success-feedback" role="status">
            ✓ Task added to your workspace
          </div>
        )}
      </form>
    </section>
  );
}
