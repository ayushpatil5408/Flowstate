import { useState } from "react";
import { PRESET_PALETTES } from "../../constants/palettes";

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetSampleData,
  onClearAllData,
}) {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [notification, setNotification] = useState("");

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleReset = () => {
    onResetSampleData();
    setShowConfirmReset(false);
    triggerNotification("Reset to initial sample demonstration tasks.");
  };

  const handleClear = () => {
    onClearAllData();
    setShowConfirmClear(false);
    triggerNotification("All tasks and focus history cleared.");
  };

  return (
    <div className="settings-view">
      <div className="view-header">
        <h1 className="view-title">Settings</h1>
        <p className="view-subtitle">
          Customize your FLOWSTATE workspace and focus preferences.
        </p>
      </div>

      {notification && (
        <div className="form-feedback success-feedback" role="status">
          ✓ {notification}
        </div>
      )}

      <div className="settings-grid">
        {/* Focus Defaults */}
        <section className="settings-card glass-panel" aria-labelledby="focus-defaults-heading">
          <h2 id="focus-defaults-heading" className="settings-card-title">
            <span>⏱️</span> Focus Preferences
          </h2>
          <p className="settings-card-desc">
            Configure your standard focus session durations.
          </p>

          <div className="setting-row">
            <label htmlFor="default-duration" className="setting-label">
              Default Timer Duration:
            </label>
            <select
              id="default-duration"
              className="select-control"
              value={settings.defaultFocusMinutes}
              onChange={(e) =>
                onUpdateSettings({
                  defaultFocusMinutes: Number(e.target.value),
                })
              }
            >
              <option value={15}>15 Minutes</option>
              <option value={25}>25 Minutes (Standard Pomodoro)</option>
              <option value={45}>45 Minutes (Deep Work)</option>
            </select>
          </div>
        </section>

        {/* Visual Atmosphere & Motion */}
        <section className="settings-card glass-panel" aria-labelledby="visual-heading">
          <h2 id="visual-heading" className="settings-card-title">
            <span>🎨</span> Liquid Atmosphere & Motion
          </h2>
          <p className="settings-card-desc">
            Adjust the signature liquid wallpaper layer intensity and palette.
          </p>

          <div className="setting-row">
            <label htmlFor="bg-intensity" className="setting-label">
              Background Canvas Motion:
            </label>
            <select
              id="bg-intensity"
              className="select-control"
              value={settings.backgroundIntensity}
              onChange={(e) =>
                onUpdateSettings({ backgroundIntensity: e.target.value })
              }
            >
              <option value="vibrant">Vibrant Kinetic WebGL (Default)</option>
              <option value="muted">Muted Atmosphere (Reduced Light)</option>
              <option value="off">Off (Static Dark Scrim - Zero Motion)</option>
            </select>
          </div>

          <div className="setting-row">
            <label htmlFor="theme-palette" className="setting-label">
              Color Palette Theme:
            </label>
            <select
              id="theme-palette"
              className="select-control"
              value={settings.themePalette}
              onChange={(e) =>
                onUpdateSettings({ themePalette: e.target.value })
              }
            >
              {Object.keys(PRESET_PALETTES).map((name) => (
                <option key={name} value={name}>
                  {name} Atmosphere
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Data Management */}
        <section className="settings-card glass-panel" aria-labelledby="data-heading">
          <h2 id="data-heading" className="settings-card-title">
            <span>💾</span> Data & Workspace Storage
          </h2>
          <p className="settings-card-desc">
            Your tasks and focus sessions are stored locally in your browser.
          </p>

          <div className="setting-actions-column">
            <button
              type="button"
              className="action-btn-quiet"
              onClick={() => setShowConfirmReset(true)}
            >
              ↺ Reset to Sample Demo Tasks
            </button>

            <button
              type="button"
              className="action-btn-danger"
              onClick={() => setShowConfirmClear(true)}
            >
              🗑️ Clear All Tasks & Data
            </button>
          </div>
        </section>

        {/* About Information */}
        <section className="settings-card glass-panel" aria-labelledby="about-heading">
          <h2 id="about-heading" className="settings-card-title">
            <span>✦</span> About FLOWSTATE
          </h2>
          <p className="settings-card-desc">
            Version 1.0 — A calm, fluid workspace that turns a busy mind into a
            clear next step.
          </p>
          <div className="about-links">
            <a
              href="https://github.com/ayushpatil5408/Liquid-Wallpaper"
              target="_blank"
              rel="noreferrer"
              className="about-link"
            >
              GitHub Repository ↗
            </a>
            <span className="dot-sep">•</span>
            <span className="privacy-badge">100% Local Browser Storage</span>
          </div>
        </section>
      </div>

      {/* Confirmation Modals */}
      {showConfirmReset && (
        <div className="modal-backdrop" onClick={() => setShowConfirmReset(false)}>
          <div className="modal-panel glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Reset to Sample Tasks?</h3>
            <p className="modal-body-text">
              This will restore the 5 initial demonstration tasks. Your current
              tasks will be replaced.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="action-btn-quiet"
                onClick={() => setShowConfirmReset(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={handleReset}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmClear && (
        <div className="modal-backdrop" onClick={() => setShowConfirmClear(false)}>
          <div className="modal-panel glass-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Clear All Data?</h3>
            <p className="modal-body-text">
              This action permanently deletes all tasks and focus session
              history from your browser storage.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="action-btn-quiet"
                onClick={() => setShowConfirmClear(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="action-btn-danger"
                onClick={handleClear}
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
