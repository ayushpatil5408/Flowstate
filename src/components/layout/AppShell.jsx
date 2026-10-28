import PrimaryNavigation from "./PrimaryNavigation";
import LiquidBackground from "../canvas/LiquidBackground";

export default function AppShell({
  activeView,
  onNavigate,
  activeTaskCount,
  isFullscreen,
  onToggleFullscreen,
  settings,
  children,
}) {
  return (
    <div className="flowstate-app-shell">
      {/* 20% Visual Atmosphere: Signature Liquid Canvas (design.md §2) */}
      <LiquidBackground
        preset={settings.themePalette || "Nebula"}
        intensity={settings.backgroundIntensity || "vibrant"}
      />

      {/* Primary Top and Mobile Navigation */}
      <PrimaryNavigation
        activeView={activeView}
        onNavigate={onNavigate}
        activeTaskCount={activeTaskCount}
        isFullscreen={isFullscreen}
        onToggleFullscreen={onToggleFullscreen}
      />

      {/* 70% Functional Clarity: Main Content View Container */}
      <main className="app-main-content" id="main-content" role="main">
        <div className="content-inner-wrapper">{children}</div>
      </main>

      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>
    </div>
  );
}
