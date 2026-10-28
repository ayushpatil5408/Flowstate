import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook managing authoritative, drift-free focus timer state.
 * Lives in the persistent App shell so state survives navigation between views.
 *
 * @param {Object} options
 * @param {number} [options.initialMinutes=25] - Default session duration
 * @param {Function} [options.onRecordSession] - Called once upon timer reaching 0
 * @returns {Object} Timer state and action dispatchers
 */
export function useFocusTimer({ initialMinutes = 25, onRecordSession } = {}) {
  const [durationMinutes, setDurationMinutes] = useState(initialMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(initialMinutes * 60);
  const [status, setStatus] = useState("ready"); // 'ready' | 'running' | 'paused' | 'completed'

  const targetEndTimeRef = useRef(null);
  const pausedRemainingRef = useRef(initialMinutes * 60);
  const hasRecordedCompletionRef = useRef(false);
  const onRecordSessionRef = useRef(onRecordSession);

  // Keep latest callback ref to prevent unnecessary effect teardown
  useEffect(() => {
    onRecordSessionRef.current = onRecordSession;
  }, [onRecordSession]);

  // Set duration preset (only allowed when not actively running)
  const setDuration = useCallback(
    (mins) => {
      if (status === "running") return;
      const minutes = Number(mins) || 25;
      setDurationMinutes(minutes);
      const secs = minutes * 60;
      setRemainingSeconds(secs);
      pausedRemainingRef.current = secs;
      targetEndTimeRef.current = null;
      hasRecordedCompletionRef.current = false;
      setStatus("ready");
    },
    [status]
  );

  // Start timer from ready or reset state
  const start = useCallback(() => {
    if (status === "running") return;
    const remaining =
      pausedRemainingRef.current > 0
        ? pausedRemainingRef.current
        : durationMinutes * 60;
    targetEndTimeRef.current = Date.now() + remaining * 1000;
    hasRecordedCompletionRef.current = false;
    setStatus("running");
  }, [status, durationMinutes]);

  // Pause running timer
  const pause = useCallback(() => {
    if (status !== "running") return;
    const now = Date.now();
    const remaining = Math.max(
      0,
      Math.round((targetEndTimeRef.current - now) / 1000)
    );
    pausedRemainingRef.current = remaining;
    setRemainingSeconds(remaining);
    setStatus("paused");
  }, [status]);

  // Resume paused timer
  const resume = useCallback(() => {
    if (status !== "paused") return;
    targetEndTimeRef.current = Date.now() + pausedRemainingRef.current * 1000;
    setStatus("running");
  }, [status]);

  // Reset timer back to durationMinutes
  const reset = useCallback(() => {
    const secs = durationMinutes * 60;
    pausedRemainingRef.current = secs;
    targetEndTimeRef.current = null;
    hasRecordedCompletionRef.current = false;
    setRemainingSeconds(secs);
    setStatus("ready");
  }, [durationMinutes]);

  // Authoritative drift-free countdown engine
  useEffect(() => {
    if (status !== "running") return;

    if (!targetEndTimeRef.current) {
      targetEndTimeRef.current =
        Date.now() + pausedRemainingRef.current * 1000;
    }

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(
        0,
        Math.round((targetEndTimeRef.current - now) / 1000)
      );
      setRemainingSeconds(diff);

      if (diff <= 0) {
        pausedRemainingRef.current = 0;
        setStatus("completed");
        if (!hasRecordedCompletionRef.current) {
          hasRecordedCompletionRef.current = true;
          if (onRecordSessionRef.current) {
            onRecordSessionRef.current(durationMinutes);
          }
        }
      }
    };

    // Calculate immediately on effect mount/status transition
    tick();

    const intervalId = setInterval(tick, 500);

    // Synchronize immediately when tab regains focus or visibility
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [status, durationMinutes]);

  const totalSeconds = durationMinutes * 60;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)
  );

  return {
    durationMinutes,
    remainingSeconds,
    status,
    progressPercent,
    start,
    pause,
    resume,
    reset,
    setDuration,
  };
}
