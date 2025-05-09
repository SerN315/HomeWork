import React, { useState } from "react";
import { X, Minus } from "lucide-react";
import "../styles/widgetWrapper.scss";

type WidgetWrapperProps = {
  title: string;
  onClose?: () => void;
  onMinimize?: () => void;
  children: React.ReactNode;
  minimized?: boolean;
};

export default function WidgetWrapper({
  title,
  onClose,
  onMinimize,
  children,
  minimized = false,
}: WidgetWrapperProps) {
  const [showControls, setShowControls] = useState(false);
  let pressTimer: NodeJS.Timeout;

  const handleMouseDown = () => {
    pressTimer = setTimeout(() => {
      setShowControls(true);
    }, 500); 
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimer);
    setTimeout(() => {
        setShowControls(false);
      }, 3000); 
  };

  const stopDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="widgetWrapper"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Clear timer if mouse leaves the area
    >
      <div className={`widgetWrapper__drag-handle ${showControls ? "show" : ""}`}>
        <div
          className={`widgetWrapper__controls ${showControls ? "show" : ""}`}
        >
          <div className="controlsButtons" onMouseDown={stopDrag}>
            {onMinimize && (
              <button
                onClick={(e) => {
                  stopDrag(e);
                  onMinimize();
                }}
                className="minimize-button"
              >
                <Minus size={16} />
              </button>
            )}
            {onClose && (
              <button
                onClick={(e) => {
                  stopDrag(e);
                  onClose();
                }}
                className="close-button"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      {!minimized && <div className="widgetWrapper__inner">{children}</div>}
    </div>
  );
}