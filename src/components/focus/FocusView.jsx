import { formatTimer } from "../../utils/dateUtils";
import PriorityBadge from "../common/PriorityBadge";

export default function FocusView({
  focusTask,
  activeTasks = [],
  onSelectFocusTask,
  onCompleteTask,
  timer,
}) {
  const {
    durationMinutes,
    remainingSeconds,
    status,
    progressPercent,
    start: handleStart,
    pause: handlePause,
    resume: handleResume,
    reset: handleReset,
    setDuration: handleSelectPreset,
  } = timer;

  return (
    <div className="focus-view">
      <div className="focus-container glass-panel">
        {/* Focus Target Header */}
        <div className="focus-target-section">
          <span className="focus-badge">🎯 FOCUS IMMERSION</span>

          {focusTask ? (
            <div className="focus-active-task-card">
              <span className="task-target-label">Focus Target:</span>
              <h2 className="focus-task-title">{focusTask.title}</h2>
              <div className="task-target-meta">
                <PriorityBadge priority={focusTask.priority} />
                <button
                  type="button"
                  className="change-target-btn"
                  onClick={() => onSelectFocusTask(null)}
                >
                  Change Task
                </button>
              </div>
            </div>
          ) : (
            <div className="focus-select-prompt">
              <h2 className="focus-task-title">No task selected</h2>
              <label htmlFor="focus-task-dropdown" className="target-label">
                Choose a task to center your attention:
              </label>
              <select
                id="focus-task-dropdown"
                className="select-control focus-dropdown"
                value=""
                onChange={(e) => {
                  const t = activeTasks.find((item) => item.id === e.target.value);
                  if (t) onSelectFocusTask(t);
                }}
              >
                <option value="">Select an active task...</option>
                {activeTasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.priority} priority)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Circular Progress & Timer Display */}
        <div className="timer-display-wrapper">
          <div className="timer-circle-container">
            <svg className="timer-progress-ring" viewBox="0 0 280 280">
              <circle
                className="progress-ring-bg"
                cx="140"
                cy="140"
                r="120"
                fill="transparent"
                strokeWidth="6"
              />
              <circle
                className="progress-ring-fill"
                cx="140"
                cy="140"
                r="120"
                fill="transparent"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={
                  2 * Math.PI * 120 * (1 - progressPercent / 100)
                }
              />
            </svg>

            <div className="timer-center-content">
              <span className="timer-digits">{formatTimer(remainingSeconds)}</span>
              <span className="timer-status-tag">
                {status === "running"
                  ? "IN FLOW"
                  : status === "paused"
                  ? "PAUSED"
                  : status === "completed"
                  ? "SESSION COMPLETE"
                  : "READY"}
              </span>
            </div>
          </div>
        </div>

        {/* Duration Presets */}
        <div className="duration-presets-group">
          {[15, 25, 45].map((mins) => (
            <button
              key={mins}
              type="button"
              disabled={status === "running"}
              className={`preset-btn ${durationMinutes === mins ? "active" : ""}`}
              onClick={() => handleSelectPreset(mins)}
            >
              {mins} Minutes
            </button>
          ))}
        </div>

        {/* Timer Control Actions */}
        <div className="timer-actions-row">
          {status === "ready" && (
            <button
              type="button"
              className="primary-btn timer-btn-large"
              onClick={handleStart}
            >
              ▶ Start Focus
            </button>
          )}

          {status === "running" && (
            <button
              type="button"
              className="action-btn timer-btn-large"
              onClick={handlePause}
            >
              ⏸ Pause
            </button>
          )}

          {status === "paused" && (
            <button
              type="button"
              className="primary-btn timer-btn-large"
              onClick={handleResume}
            >
              ▶ Resume
            </button>
          )}

          {(status === "running" || status === "paused") && (
            <button
              type="button"
              className="action-btn-quiet"
              onClick={handleReset}
            >
              ↺ Reset
            </button>
          )}

          {status === "completed" && (
            <div className="session-completed-banner">
              <span className="celebration-icon">🎉</span>
              <p className="session-completed-text">
                Focus session completed! Great work.
              </p>
              <button
                type="button"
                className="primary-btn"
                onClick={handleReset}
              >
                Start Another Session
              </button>
            </div>
          )}
        </div>

        {/* Task Completion Separation (PRD §7.6) */}
        {focusTask && !focusTask.completed && (
          <div className="focus-task-resolution">
            <span>Finished this task?</span>
            <button
              type="button"
              className="complete-task-btn"
              onClick={() => onCompleteTask(focusTask.id)}
            >
              ✓ Mark Task Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
