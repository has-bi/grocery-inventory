"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Rest countdown between sets.
 *
 * Deadline-based rather than tick-based: mobile browsers throttle timers in
 * background tabs, so counting down a variable would drift or freeze while the
 * screen is off. Storing the target timestamp keeps it accurate regardless.
 */
export function useRestTimer() {
  const [endsAt, setEndsAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [duration, setDuration] = useState(0);
  const [label, setLabel] = useState("");
  const firedRef = useRef(false);

  useEffect(() => {
    if (!endsAt) return;

    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);

      if (left === 0 && !firedRef.current) {
        firedRef.current = true;
        if (typeof navigator !== "undefined" && navigator.vibrate) {
          navigator.vibrate([120, 60, 120]);
        }
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const start = useCallback((seconds, timerLabel = "") => {
    if (!seconds || seconds <= 0) return;
    firedRef.current = false;
    setDuration(seconds);
    setLabel(timerLabel);
    setEndsAt(Date.now() + seconds * 1000);
  }, []);

  const stop = useCallback(() => {
    setEndsAt(null);
    setRemaining(0);
    setDuration(0);
    setLabel("");
  }, []);

  const extend = useCallback((seconds) => {
    firedRef.current = false;
    setDuration((d) => d + seconds);
    setEndsAt((prev) => (prev ? Math.max(prev, Date.now()) + seconds * 1000 : null));
  }, []);

  return {
    active: endsAt !== null,
    remaining,
    duration,
    label,
    isDone: endsAt !== null && remaining === 0,
    start,
    stop,
    extend,
  };
}
