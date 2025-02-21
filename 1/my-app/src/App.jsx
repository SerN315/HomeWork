import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";
import Timer from "./components/Timer";
import CardGrid from "./components/cardGrid";
const socket = io("http://localhost:3001");
import { fetchCardsFromDB } from "./features/pullCards";

const difficultiesSetting = {
  easy: { time: 40, pairs: 2 },
  medium: { time: 20, pairs: 4 },
  hard: { time: 10, pairs: 6 },
};

const generateCards = (allCards, difficulty) => {
  if (!allCards.length) return [];

  const { pairs } = difficultiesSetting[difficulty];

  // Select required number of pairs
  const selectedCards = allCards.slice(0, pairs);

  // Duplicate and assign unique IDs
  const pairedCards = selectedCards.flatMap((card, index) => [
    { ...card, id: index * 2 },
    { ...card, id: index * 2 + 1 },
  ]);

  return pairedCards.sort(() => Math.random() - 0.5); // Shuffle
};

function App() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("userName") || ""; // Load from localStorage if available
  });
  const [isNameSet, setIsNameSet] = useState(
    !!localStorage.getItem("userName")
  );
  const [difficulties, setDifficulties] = useState("easy");
  const [history, setHistory] = useState([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    difficultiesSetting[difficulties].time
  );
  const getMoves = () => movesRef.current; // access latest moves
  const [isStart, setStart] = useState(false);
  const [finish, setFinish] = useState(false);
  const [allCards, setAllCards] = useState([]); // Store fetched cards
  const [cards, setCards] = useState([]); // Store generated cards

  const timeLeftRef = useRef(difficultiesSetting[difficulties].time);
  const movesRef = useRef(0);

  const incrementMoves = () => {
    movesRef.current += 1;
  };

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
  }, [userName]);

  //Fetch cards once and store in `allCards`
  useEffect(() => {
    const loadCards = async () => {
      try {
        const fetchedCards = await fetchCardsFromDB();
        setAllCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    loadCards();
  }, []);

  // Generate cards when difficulty changes (and `allCards` is available)
  useEffect(() => {
    if (allCards.length > 0) {
      setCards(generateCards(allCards, difficulties));
    }
  }, [allCards, difficulties]);

  const handleTimeUpdate = (newTime) => {
    timeLeftRef.current = newTime;
  };

  const handleTimeOut = () => {
    if (finish) return;

    console.log("Timeout reached! Ending game...");
    setFinish(true);
    setStart(false);
    setTimeLeft(0);

    const newHistory = { moves: movesRef.current, time: 0, stat: "Lost" };
    setHistory((prevHistory) => [...prevHistory, newHistory]);

    const gameData = {
      userName,
      moves,
      time: 0,
      stat: "Lost",
    };

    socket.emit("save_game", gameData);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  const handleUserNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("userName", userName);
      setIsNameSet(true);
    }
  };

  //Memoize card generation based on difficulty
  const memoizedCards = useMemo(
    () => generateCards(allCards, difficulties),
    [allCards, difficulties]
  );

  function completeHandler(finalMoves) {
    if (finish) return;

    console.log("Game Completed!");
    setFinish(true);
    setStart(false);

    console.log("Final Time Left:", timeLeftRef.current);

    setHistory((prevHistory) => [
      ...prevHistory,
      { moves: finalMoves, time: timeLeftRef.current, stat: "Win" },
    ]);

    const gameData = {
      userName,
      moves: finalMoves,
      time: timeLeftRef.current,
      stat: "Win",
    };

    socket.emit("save_game", gameData);
  }

  const resetGame = useCallback(() => {
    if (allCards.length === 0) return;
    console.log("Resetting game...");
    setCards(generateCards(allCards, difficulties));
    setMoves(0);
    setTimeLeft(difficultiesSetting[difficulties].time);
    setStart(true);
    setFinish(false);
  }, [allCards, difficulties]);

  const backToStart = useCallback(() => {
    console.log("Resetting game...");
    setStart(false);
    setFinish(false);
  }, []);

  const handleDifficultyChange = (event) => {
    setDifficulties(event.target.value);
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
            <div
              className="Uinfo"
              style={{ display: isStart ? "none" : "block" }}
            >
              {!isNameSet ? (
                <form onSubmit={handleUserNameSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <button type="submit">Save Name</button>
                </form>
              ) : (
                <p>
                  Welcome back, <strong>{userName}</strong>!
                </p>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem("userName");
                  setUserName("");
                  setIsNameSet(false);
                }}
              >
                Change Username
              </button>
            </div>
            <button
              onClick={resetGame}
              className="start-btn"
              style={{
                display: isStart ? "none" : "block",
              }}
            >
              <h2>Start</h2>
            </button>
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
          onTimeUpdate={handleTimeUpdate}
          finish={finish}
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
              memoizedCards={memoizedCards}
              onGameComplete={completeHandler}
              incrementMoves={incrementMoves}
              getMoves={getMoves}
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
            <h2> Remaining Time: {formatTime(timeLeftRef.current)}</h2>
            <button onClick={resetGame} className="reset-btn">
              Restart Game
            </button>
            <button onClick={backToStart} className="reset-btn">
              Back To Start
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
    </div>
  );
}

export default App;
