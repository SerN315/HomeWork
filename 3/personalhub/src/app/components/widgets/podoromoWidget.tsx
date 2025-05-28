// components/widgets/PomodoroWidget.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import BaseWidget from "./BaseWidget";
import  WidgetProps  from "@/app/types/widget";

const DEFAULT_TIME = 25 * 60; // 25 minutes

export default function PomodoroWidget(props: WidgetProps) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    pause();
    setTimeLeft(DEFAULT_TIME);
  };

  return (
    <BaseWidget title="Pomodoro" {...props}>
      <div className="pomodoro-widget__container">
        <h2 className="pomodoro-widget__container__timer">{formatTime(timeLeft)}</h2>
        <div className="pomodoro-widget__container__controls">
          {!isRunning ? (
            <button onClick={start} className="pomodoro-start">
              Start
            </button>
          ) : (
            <button onClick={pause} className="pomodoro-pause">
              Pause
            </button>
          )}
          <button onClick={reset} className="pomodoro-reset">
            Reset
          </button>
        </div>
      </div>
    </BaseWidget>
  );
}
