import React, { useEffect, useState, useRef } from "react";

const Timer = ({ initialTime, isStart, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isStart) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            onTimeout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isStart, onTimeout]);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  return <div className="timer">{formatTime(timeLeft)}</div>;
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default Timer;
