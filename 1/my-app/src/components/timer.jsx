import React, { useEffect, useState, useRef } from "react";

const Timer = ({ initialTime, isStart, onTimeout, onTimeUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);
  const lastTimeLeftRef = useRef(initialTime); // ✅ Store time without triggering re-renders

  useEffect(() => {
    setTimeLeft(initialTime);
    lastTimeLeftRef.current = initialTime; // ✅ Reset stored time on difficulty change
  }, [initialTime,isStart]);

  useEffect(() => {
    if (isStart) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            onTimeUpdate(0); // ✅ Ensure last update before stopping
            onTimeout();
            return 0;
          }
          const updatedTime = prevTime - 1;
          onTimeUpdate(updatedTime); // ✅ Send update to App.js without re-render
          return updatedTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      onTimeUpdate(lastTimeLeftRef.current); // ✅ Store last time in ref when stopping
    }
  
    return () => clearInterval(timerRef.current);
  }, [isStart]);
  
  
  

  return <div className="timer">{formatTime(timeLeft)}</div>;
};

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default Timer;
