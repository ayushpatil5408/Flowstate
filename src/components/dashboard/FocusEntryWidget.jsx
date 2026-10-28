export default function FocusEntryWidget({
  focusTask,
  activeTasks = [],
  onSelectTask,
  onStartFocus,
}) {
  return (
    <aside className="focus-entry-card glass-panel" aria-labelledby="focus-widget-heading">
      <div className="focus-widget-header">
        <span className="focus-badge">🎯 DAILY FOCUS</span>
        <h3 id="focus-widget-heading" className="focus-widget-title">
          Single-Task Immersion
        </h3>
      </div>

      <div className="focus-widget-body">
        {focusTask ? (
          <div className="selected-focus-target">
            <span className="target-label">Current target:</span>
            <p className="target-title">{focusTask.title}</p>
          </div>
        ) : (
          <div className="no-focus-target">
            <label htmlFor="focus-target-select" className="target-label">
              Choose task to focus on:
            </label>
            <select
              id="focus-target-select"
              className="select-control focus-select"
              value={focusTask ? focusTask.id : ""}
              onChange={(e) => {
                const found = activeTasks.find((t) => t.id === e.target.value);
                if (found) onSelectTask(found);
              }}
            >
              <option value="">Select an active task...</option>
              {activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="preset-timer-row">
          <span className="preset-label">Presets:</span>
          <div className="preset-buttons-group">
            {[15, 25, 45].map((mins) => (
              <button
                key={mins}
                type="button"
                className="preset-time-btn"
                onClick={() => onStartFocus(mins)}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="primary-btn start-focus-btn"
          onClick={() => onStartFocus()}
        >
          <span>Enter Focus Space →</span>
        </button>
      </div>
    </aside>
  );
}
