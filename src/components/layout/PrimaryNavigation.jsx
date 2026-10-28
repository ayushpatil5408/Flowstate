export default function PrimaryNavigation({
  activeView,
  onNavigate,
  activeTaskCount = 0,
  isFullscreen,
  onToggleFullscreen,
}) {
  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    {
      id: "tasks",
      label: "My Tasks",
      icon: "📋",
      badge: activeTaskCount > 0 ? activeTaskCount : null,
    },
    { id: "focus", label: "Focus", icon: "🎯" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <header className="app-topbar" role="banner">
        <div className="topbar-brand-group">
          <button
            type="button"
            className="brand-link"
            onClick={() => onNavigate("overview")}
            aria-label="FLOWSTATE Dashboard Home"
          >
            <span className="brand-mark" aria-hidden="true">
              ✦
            </span>
            <div className="brand-text-block">
              <span className="brand-title">FLOWSTATE</span>
              <span className="brand-tagline">Find your flow</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="desktop-nav" role="navigation" aria-label="Primary Navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-tab ${activeView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
              aria-current={activeView === item.id ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Topbar Utility Actions */}
        <div className="topbar-actions">
          <button
            type="button"
            className="action-btn-quiet fullscreen-btn"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <span>{isFullscreen ? "⛶ Exit" : "⛶ Fullscreen"}</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (design.md §9) */}
      <nav className="mobile-bottom-nav" role="navigation" aria-label="Mobile Navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-btn ${activeView === item.id ? "active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeView === item.id ? "page" : undefined}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
            {item.badge && <span className="mobile-nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>
    </>
  );
}
