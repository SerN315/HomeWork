import React, { useEffect, useRef, useState } from "react";
import BaseWidget from "./BaseWidget";
import "../../styles/widgets/AnalogClock.scss"; 
import WidgetProps from "@/app/types/widget";

const AnalogClock: React.FC<{ paused?: boolean }> = ({ paused }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [paused]);

  const hour = (time.getHours() % 12) + time.getMinutes() / 60;
  const minute = time.getMinutes() + time.getSeconds() / 60;
  const second = time.getSeconds();

  return (
    <div className="clock-container">
      <div className="clock-wrapper">
        <div className="clock-base">
          <div className="clock-dial">
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="clock-indicator" key={i} />
            ))}
          </div>
          <div
            className="clock-hour"
            style={{ transform: `rotate(${hour * 30}deg)` }}
          />
          <div
            className="clock-minute"
            style={{ transform: `rotate(${minute * 6}deg)` }}
          />
          <div
            className="clock-second"
            style={{ transform: `rotate(${second * 6}deg)` }}
          />
          <div className="clock-center" />
        </div>
      </div>
    </div>
  );
};

export default function WatchWidget(props: WidgetProps & { paused?: boolean }) {
  return (
    <BaseWidget title="Analog Clock" {...props}>
      <AnalogClock paused={props.paused} />
    </BaseWidget>
  );
}