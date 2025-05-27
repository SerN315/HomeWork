"use client";
import React from "react";
import { useState } from "react";
import WidgetWrapper from "@/app/components/ultis/widgetWrappet";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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
    { i: "sticky", x: 0, y: 0, w: 4, h: 3 },
    { i: "todo", x: 4, y: 0, w: 4, h: 4 },
    { i: "weather", x: 8, y: 0, w: 4, h: 3 },
    { i: "pomodoro", x: 0, y: 3, w: 4, h: 3 },
    { i: "clock", x: 4, y: 3, w: 4, h: 3 },
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

  return (
    <div className="p-6">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        draggableHandle=".widgetWrapper__drag-handle"
      >
        {layout.map((item) =>
          widgets[item.i as keyof typeof widgets]?.visible ? (
            <div key={item.i}>
              <WidgetWrapper
                title={item.i}
                onClose={() => handleClose(item.i as keyof typeof widgets)}
                onMinimize={() =>
                  handleMinimize(item.i as keyof typeof widgets)
                }
                minimized={widgets[item.i as keyof typeof widgets].minimized}
              >
                {!widgets[item.i as keyof typeof widgets].minimized && (
                  <div className="bg-yellow-200 p-2">
                    {/* content varies by widget */}
                    {item.i === "sticky" && "📝 Write your note here..."}
                    {item.i === "weather" && "🌦️ Weather widget"}
                    {item.i === "pomodoro" && "⏳ Pomodoro Clock"}
                    {item.i === "clock" && "🕒 Normal Clock"}
                    {item.i === "todo" && (
                      <ul className="list-disc pl-5">
                        <li>Finish layout</li>
                        <li>Make it pretty</li>
                      </ul>
                    )}
                  </div>
                )}
              </WidgetWrapper>
            </div>
          ) : null
        )}
      </GridLayout>
    </div>
  );
};

export default DashboardPage;
