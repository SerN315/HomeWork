import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function GameHistory({ userName, isStart, history, setHistory }) {
  useEffect(() => {
    if (userName) {
      socket.emit("load_history", userName);

      socket.on("game_history", (history) => {
        setHistory(history);
        console.log("Game history loaded:", history);
      });

      return () => {
        socket.off("game_history");
      };
    }
  }, [userName, setHistory]);

  return (
    <div
      className="historyboard"
      style={{ display: !isStart ? "block" : "none" }}
    >
      <h2>History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <h2>{index + 1}</h2>
              <h2>Moves: {entry.moves}</h2>
              <h2>Status: {entry.stat}</h2>
              <h2>Remaining Time: {entry.time}s</h2>
            </li>
          ))}
        </ul>
      ) : (
        <h1>You haven't even tried</h1>
      )}
    </div>
  );
}

export default GameHistory;
