import { useState, useEffect } from "react";
import "./App.css";
import Card from "./components/card";
import { useRef } from "react"; // Import useRef

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
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(
    difficultiesSetting[difficulties].time
  );
  const [isStart, setStart] = useState(false);
  const [finish, setFinish] = useState(false);
  const [cards, setCards] = useState(() => generateCards("easy"));

  const [activeCards, setActiveCards] = useState([]);
  const [matchPairs, setMatchPairs] = useState([]);

  const timeoutCalled = useRef(false); // Track if timeout was handled
  const gameCompleted = useRef(false); // Track if game completion was handled

  useEffect(() => {
    setCards(generateCards(difficulties));
    setTimeLeft(difficultiesSetting[difficulties].time);
    setFinish(false);
  }, [difficulties]);

  function startTimer() {
    clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(newTimer);
          handleTimeOut();
          return 0;
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
    setTimer(newTimer);
  }

  const handleTimeOut = () => {
    if (timeoutCalled.current) return; // Prevent multiple calls
    timeoutCalled.current = true; // Mark timeout as handled

    console.log("Timeout reached! Ending game...");

    clearInterval(timer);
    setTimer(null);
    setFinish(true);
    setStart(false);
    setTimeLeft(0);

    setMoves((prevMoves) => {
      const finalMoves = prevMoves;
      setHistory((prevHistory) => [
        ...prevHistory,
        { movenumb: finalMoves, time: 0, stat: "Lost" },
      ]);
      return prevMoves; // Keep state consistent
    });
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const handleCardClick = (id) => {
    if (
      activeCards.length === 2 ||
      activeCards.includes(id) ||
      matchPairs.includes(id)
    )
      return;

    const newFlipped = [...activeCards, id];
    setActiveCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map((cardId) =>
        cards.find((card) => card.id === cardId)
      );
      setMoves((prev) => prev + 1);
      console.log(moves);
      if (first?.value === second?.value) {
        const newMatchPairs = [...matchPairs, first.id, second.id];
        setMatchPairs(newMatchPairs);
        if (newMatchPairs.length === cards.length) {
          completeHandler();
        }
      }

      setTimeout(() => setActiveCards([]), 600);
    }
  };

  const completeHandler = () => {
    if (gameCompleted.current) return;
    gameCompleted.current = true; // Mark completion as handled

    clearInterval(timer);
    setFinish(true);
    setStart(false);

    console.log("Game Completed!");

    setMoves((prevMoves) => {
      const finalMoves = prevMoves;
      setHistory((prevHistory) => [
        ...prevHistory,
        { movenumb: finalMoves, time: timeLeft, stat: "Win" },
      ]);
      return prevMoves; // Keep state consistent
    });
  };

  const resetGame = () => {
    console.log("Resetting game...");

    clearInterval(timer);
    setTimer(null);

    const newCards = generateCards(difficulties); // Generate new cards
    setCards(newCards);

    setMoves(0); // Reset move count
    setTimeLeft(difficultiesSetting[difficulties].time); // Reset time
    setActiveCards([]);
    setMatchPairs([]);
    setStart(true);
    setFinish(false);

    timeoutCalled.current = false; // Reset timeout tracker
    gameCompleted.current = false; // Reset game completion tracker

    startTimer(); // Start fresh timer
  };

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
        <div
          className="timer"
          style={{
            opacity: isStart ? "1" : "0",
            height: isStart ? "100%" : "0",
            transition: "0.3s",
          }}
        >
          {formatTime(timeLeft)}
        </div>
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
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                imgurl={card.imgurl}
                choosen={
                  activeCards.includes(card.id) || matchPairs.includes(card.id)
                }
                handleCardClick={handleCardClick}
              />
            ))}
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
            <h2> Done in {formatTime(timeLeft)}</h2>
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
        {history > "0" ? (
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                <h2>{index + 1}</h2>
                <h2>Moves: {entry.movenumb}</h2>
                <h2>Status: {entry.stat}</h2>

                <h2>Done in: {entry.time}s</h2>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <h1>You havent even tried</h1>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
