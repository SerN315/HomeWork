import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import UserInfo from "../components/userInfo";
import Difficulties from "../components/Difficulites";
import GameContent from "../components/gameLogic";
import GameHistory from "../components/history";

function SoloMode() {
  const [history, setHistory] = useState([]);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });
  const [isNameSet, setIsNameSet] = useState(
    !!localStorage.getItem("userName")
  );
  const [difficulties, setDifficulties] = useState("easy");
  const [isStart, setStart] = useState(false);
  const [finish, setFinish] = useState(false);

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("userName", userName);
      setIsNameSet(true);
    }
  };

  // const updateHistory = (newHistory) => {
  //   setHistory((prevHistory) => [...prevHistory, newHistory]);
  // };

  // const updateTimeLeft = (newTime) => {
  //   setTimeLeft(newTime);
  // };

  return (
    <div className="game">
      {!finish && (
        <div
          className="topContainer"
          style={{
            top: isStart ? "0" : "150px",
            left: isStart ? "0" : "-1.5%",
            transition: "0.3s",
          }}
        >
          <h1>Meme Matcher</h1>
          <div>
            <UserInfo
              userName={userName}
              setUserName={setUserName}
              isNameSet={isNameSet}
              setIsNameSet={setIsNameSet}
              handleUserNameSubmit={handleUserNameSubmit}
              isStart={isStart}
            />
            <button
              onClick={() => setStart(true)}
              className="start-btn"
              style={{
                display: isStart ? "none" : "block",
              }}
            >
              <h2>Start</h2>
            </button>
            <button
              className="start-btn"
              style={{ display: isStart ? "none" : "block" }}
            >
              <Link
                to="/multiplayer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Start Multiplayer
              </Link>
            </button>
            <Difficulties
              difficulties={difficulties}
              handleDifficultyChange={(event) =>
                setDifficulties(event.target.value)
              }
              isStart={isStart}
            />
          </div>
        </div>
      )}

      <GameContent
        userName={userName}
        isStart={isStart}
        setStart={setStart}
        finish={finish}
        setFinish={setFinish}
        difficulties={difficulties}
        setDifficulties={setDifficulties}
        updateHistory={setHistory}
      />

      <GameHistory
        userName={userName}
        isStart={isStart}
        history={history}
        setHistory={setHistory}
      />
    </div>
  );
}

export default SoloMode;
// {
//   !isStart && timeLeft > "0" && (
//     <div
//       className="completeScreen"
//       style={{
//         display: finish ? "block" : "none",
//       }}
//     >
//       <div className="completeScreenContents">
//         <h1>Congratulation you outdone yourself</h1>
//         <h2> Remaining Time: {formatTime(timeLeftRef.current)}</h2>
//         <button onClick={resetGame} className="reset-btn">
//           Restart Game
//         </button>
//         <button onClick={backToStart} className="reset-btn">
//           Back To Start
//         </button>
//       </div>
//     </div>
//   );
// }

// {
//   !isStart && timeLeft <= 1 && (
//     <div
//       className="completeScreen"
//       style={{
//         display: finish ? "block" : "none",
//       }}
//     >
//       <div className="completeScreenContents">
//         <h1> 🥲You failed a child's game 🥲 </h1>
//         <h2> Do better next time</h2>
//         <button onClick={resetGame} className="reset-btn">
//           Restart Game
//         </button>
//         <button onClick={backToStart} className="reset-btn">
//           Back To Start
//         </button>
//       </div>
//     </div>
//   );
// }
// <div className="historyboard" style={{ display: !isStart ? "block" : "none" }}>
//   <h2>History</h2>
//   {history.length > 0 ? (
//     <ul>
//       {history.map((entry, index) => (
//         <li key={index}>
//           <h2>{index + 1}</h2>
//           <h2>Moves: {entry.moves}</h2>
//           <h2>Status: {entry.stat}</h2>
//           <h2>Remaining Time: {entry.time}s</h2>
//         </li>
//       ))}
//     </ul>
//   ) : (
//     <h1>You haven't even tried</h1>
//   )}
// </div>;
