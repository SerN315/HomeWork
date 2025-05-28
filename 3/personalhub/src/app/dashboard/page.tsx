"use client";
import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import PomodoroWidget from "@/app/components/widgets/podoromoWidget";

const DashboardPage: React.FC = () => {
  const initialWidgets = {
    sticky: { visible: true, minimized: false },
    todo: { visible: true, minimized: false },
    weather: { visible: true, minimized: false },
    pomodoro: { visible: true, minimized: false },
    clock: { visible: true, minimized: false },
  };

  const [widgets, setWidgets] = useState(initialWidgets);

  const layout = [
    { i: "sticky", x: 0, y: 0, w: 4, h: 1 },
    { i: "todo", x: 4, y: 0, w: 4, h: 1 },
    { i: "weather", x: 8, y: 0, w: 4, h: 1 },
    { i: "pomodoro", x: 0, y: 3, w: 4, h: 1 },
    { i: "clock", x: 4, y: 3, w: 4, h: 1 },
  ];

  const handleClose = (id: keyof typeof initialWidgets) => {
    setWidgets((prev) => ({
      ...prev,
      [id]: { ...prev[id], visible: false },
    }));
  };

  const handleMinimize = (id: keyof typeof initialWidgets) => {
    setWidgets((prev) => ({
      ...prev,
      [id]: { ...prev[id], minimized: !prev[id].minimized },
    }));
  };

  const renderWidget = (id: string) => {
    const minimized = widgets[id as keyof typeof widgets]?.minimized;

    switch (id) {
      case "pomodoro":
        return (
          <PomodoroWidget
            id="pomodoro"
            minimized={minimized}
            onClose={() => handleClose("pomodoro")}
            onMinimize={() => handleMinimize("pomodoro")}
          />
        );
      case "sticky":
        return <div>📝 Sticky Note goes here</div>;
      case "todo":
        return (
          <div>
            <ul className="list-disc pl-5">
              <li>Finish layout</li>
              <li>Make it pretty</li>
            </ul>
          </div>
        );
      case "weather":
        return <div>🌦️ Weather widget</div>;
      case "clock":
        return <div>🕒 Current time display</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        width={1200}
        autoSize={true}
        draggableHandle=".widgetWrapper__drag-handle"
      >
        {layout.map((item) => {
          const id = item.i as keyof typeof widgets;
          if (!widgets[id]?.visible) return null;

          return (
            <div key={item.i} data-grid={item}>
              {renderWidget(item.i)}
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
};

export default DashboardPage;
