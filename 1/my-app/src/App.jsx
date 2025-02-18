import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "./App.css";
import Timer from "./components/Timer";
import CardGrid from "./components/cardGrid";

const difficultiesSetting = {
  easy: { time: 40, pairs: 2 },
  medium: { time: 20, pairs: 4 },
  hard: { time: 10, pairs: 6 },
};

const Cards = [
  { value: "1", imgurl: "/sasuke.png" },
  { value: "2", imgurl: "/meme1.jpg" },
  { value: "3", imgurl: "/meme2.jpg" },
  { value: "4", imgurl: "/meme3.jpg" },
  { value: "5", imgurl: "/meme4.jpg" },
  { value: "6", imgurl: "/vite.svg" },
];

const generateCards = (difficulties) => {
  const { pairs } = difficultiesSetting[difficulties];

  const selectedCards = Cards.slice(0, pairs);

  const pairedCards = selectedCards.flatMap((card, index) => [
    { ...card, id: index * 2 },
    { ...card, id: index * 2 + 1 },
  ]);

  // Shuffle and return
  return pairedCards.sort(() => Math.random() - 0.5);
};

function App() {
  const [difficulties, setdifficulties] = useState("easy");
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(0);
  const timeLeftRef = useRef(difficultiesSetting[difficulties].time);
  const [timeLeft, setTimeLeft] = useState(timeLeftRef.current);
  const [isStart, setStart] = useState(false);
  const [finish, setFinish] = useState(false);
  const [cards, setCards] = useState(() => generateCards("easy"));

  useEffect(() => {
    setCards(generateCards(difficulties));
    setTimeLeft(difficultiesSetting[difficulties].time);
    setFinish(false);
  }, [difficulties]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (timeLeft === 0 && isStart) {
      handleTimeOut();
    }
  }, [timeLeft, isStart]);

  const handleTimeOut = () => {
    if (finish) return; // Prevent multiple calls

    console.log("Timeout reached! Ending game...");

    clearInterval(timerRef.current);
    setFinish(true);
    setStart(false);
    setTimeLeft(0);

    const finalMoves = moves; // Store the moves count before resetting it
    setHistory((prevHistory) => [
      ...prevHistory,
      { movenumb: finalMoves, time: 0, stat: "Lost" },
    ]);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const memoizedCards = useMemo(
    () => generateCards(difficulties),
    [difficulties]
  );

  const completeHandler = useCallback(
    (finalMoves, currentTimeLeft) => {
      if (finish) return; // Prevent multiple calls

      clearInterval(timerRef.current);
      setFinish(true);
      setStart(false);

      console.log("Game Completed!");

      setHistory((prevHistory) => [
        ...prevHistory,
        { movenumb: finalMoves, time: currentTimeLeft, stat: "Win" },
      ]);
    },
    [finish]
  );

  const resetGame = useCallback(() => {
    console.log("Resetting game...");

    clearInterval(timerRef.current);

    const newCards = generateCards(difficulties); // Generate new cards is not optimize create a shuffle function instead
    setCards(newCards);

    setMoves(0); // Reset move count
    setTimeLeft(difficultiesSetting[difficulties].time); // Reset time
    setStart(true);
    setFinish(false);
  }, [difficulties]);

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
            <button
              onClick={resetGame}
              className="start-btn"
              style={{
                display: isStart ? "none" : "block",
              }}
            >
              <h2>Start</h2>
            </button>
            <div className="difficulties">
              <label>
                <input
                  type="radio"
                  name="difficulties"
                  value="easy"
                  checked={difficulties === "easy"}
                  onChange={() => setdifficulties("easy")}
                />
                <span>Easy</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulties"
                  value="medium"
                  checked={difficulties === "medium"}
                  onChange={() => setdifficulties("medium")}
                />
                <span>Medium</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="difficulties"
                  value="hard"
                  checked={difficulties === "hard"}
                  onChange={() => setdifficulties("hard")}
                />
                <span>Hard</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div
        className="indicators"
        style={{
          opacity: isStart ? "1" : "0",
          height: isStart ? "100px" : "0",
          transition: "0.3s",
        }}
      >
        <Timer
          initialTime={difficultiesSetting[difficulties].time}
          isStart={isStart}
          onTimeout={handleTimeOut}
        />
        <div className="points"></div>
      </div>
      <div
        className="game__content"
        style={{
          opacity: isStart ? "1" : "0",
          height: isStart ? "500px" : "0",
          transition: "0.3s",
        }}
      >
        {isStart && (
          <div
            className="game__content__grid"
            style={{
              opacity: isStart ? "1" : "0",
              height: isStart ? "100%" : "0",
              transition: "0.3s",
            }}
          >
            <CardGrid
              difficulties={difficulties}
              memoizedCards={memoizedCards}
              completeHandler={completeHandler}
              timeLeft={timeLeft}
            />
          </div>
        )}
      </div>
      {!isStart && timeLeft > "0" && (
        <div
          className="completeScreen"
          style={{
            display: finish ? "block" : "none",
          }}
        >
          <div className="completeScreenContents">
            <h1>Congratulation you outdone yourself</h1>
            <h2> Remaining Time: {formatTime(timeLeft)}</h2>
            <button onClick={resetGame} className="reset-btn">
              Restart Game
            </button>
          </div>
        </div>
      )}

      {!isStart && timeLeft <= 1 && (
        <div
          className="completeScreen"
          style={{
            display: finish ? "block" : "none",
          }}
        >
          <div className="completeScreenContents">
            <h1> 🥲You failed a child's game 🥲 </h1>
            <h2> Do better next time</h2>
            <button onClick={resetGame} className="reset-btn">
              Restart Game
            </button>
          </div>
        </div>
      )}
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
                <h2>Moves: {entry.movenumb}</h2>
                <h2>Status: {entry.stat}</h2>
                <h2>Remaining Time: {entry.time}s</h2>
              </li>
            ))}
          </ul>
        ) : (
          <h1>You haven't even tried</h1>
        )}
      </div>
    </div>
  );
}

export default App;
