// src/hooks/useTimer.ts
import { useEffect, useRef, useState } from "react";

export function useTimer(initialTime, isStart, onTimeout, onTimeUpdate) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timeLeftRef = useRef(initialTime);

  useEffect(() => {
    if (!isStart) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        onTimeUpdate(prev - 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStart]);

  return { timeLeft, timeLeftRef };
}
