import React from "react";

function Difficulties({ difficulties, handleDifficultyChange, isStart }) {
  return (
    <div
      className="difficulties"
      style={{
        display: isStart ? "none" : "flex",
      }}
    >
      {["easy", "medium", "hard"].map((level) => (
        <label key={level}>
          <input
            type="radio"
            name="difficulties"
            value={level}
            checked={difficulties === level}
            onChange={handleDifficultyChange}
          />
          <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
        </label>
      ))}
    </div>
  );
}

export default Difficulties;
