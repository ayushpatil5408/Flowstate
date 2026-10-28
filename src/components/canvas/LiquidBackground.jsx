import { useEffect, useRef } from "react";
import { PRESET_PALETTES } from "../../constants/palettes";

export default function LiquidBackground({
  preset = "Nebula",
  intensity = "vibrant", // 'vibrant' | 'muted' | 'minimal' | 'off'
  onClickBackdrop,
}) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (intensity === "off") return;

    let isMounted = true;
    const currentPreset = PRESET_PALETTES[preset] || PRESET_PALETTES.Nebula;

    const initTimer = setTimeout(async () => {
      try {
        let module;
        const dynamicImport = (u) =>
          new Function("url", "return import(url)")(u);

        try {
          // Primary: load from local bundle in public folder
          module = await dynamicImport("/tubes1.min.js");
        } catch {
          // Fallback: CDN
          module = await dynamicImport(
            "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
          );
        }

        if (!isMounted || !canvasRef.current) return;

        const TubesCursor = module.default;
        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: currentPreset.tubes,
            lights: {
              intensity: intensity === "muted" ? 100 : 200,
              colors: currentPreset.lights,
            },
          },
        });

        appRef.current = app;
      } catch (err) {
        console.warn("Liquid canvas initialization note:", err);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      if (appRef.current && typeof appRef.current.dispose === "function") {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [intensity, preset]);

  // Update palette colors dynamically
  useEffect(() => {
    if (appRef.current?.tubes) {
      const currentPreset = PRESET_PALETTES[preset] || PRESET_PALETTES.Nebula;
      appRef.current.tubes.setColors(currentPreset.tubes);
      appRef.current.tubes.setLightsColors(currentPreset.lights);
    }
  }, [preset]);

  const scrimClass = `liquid-scrim scrim-${intensity}`;

  return (
    <div className="liquid-background-container" onClick={onClickBackdrop}>
      {intensity !== "off" && (
        <canvas ref={canvasRef} className="liquid-canvas" />
      )}
      {/* High-contrast scrim ensures 70% functional readability (design.md §2) */}
      <div className={scrimClass} />
    </div>
  );
}
