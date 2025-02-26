import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function RankingBoard({ userName, isStart, rankings, setRankings }) {
  useEffect(() => {
    socket.on("update_rankings", (rankingsData) => {
      setRankings(rankingsData);
      console.log("Rankings updated:", rankingsData);
    });

    return () => {
      socket.off("update_rankings");
    };
  }, [setRankings]);

  return (
    <div
      className="historyboard"
      style={{
        display: !isStart ? "block" : "none",
        width: "100%",
        position: "unset",
      }}
    >
      <h2>🏆 Final Rankings 🏆</h2>
      {rankings.length > 0 ? (
        <ul>
          {rankings.map((entry, index) => (
            <li key={index}>
              <h2>
                #{index + 1} {entry.userName}
              </h2>
              <h2>Moves: {entry.moves}</h2>
              <h2>Status: {entry.stat}</h2>
              <h2>Remaining Time: {entry.time}s</h2>
            </li>
          ))}
        </ul>
      ) : (
        <h1>Waiting for players to finish...</h1>
      )}
    </div>
  );
}

export default RankingBoard;
