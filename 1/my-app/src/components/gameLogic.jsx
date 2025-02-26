import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Timer from "../components/timer";
import CardGrid from "../components/cardGrid";
import { io } from "socket.io-client";
import { fetchCardsFromDB } from "../features/pullCards";
import { formatTime } from "../utils/formattime";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3001");

const difficultiesSetting = {
  easy: { time: 40, pairs: 2 },
  medium: { time: 20, pairs: 4 },
  hard: { time: 10, pairs: 6 },
};

const generateCards = (allCards, difficulty) => {
  if (!allCards.length) return [];

  const { pairs } = difficultiesSetting[difficulty];

  const selectedCards = allCards.slice(0, pairs);

  const pairedCards = selectedCards.flatMap((card, index) => [
    { ...card, id: index * 2 },
    { ...card, id: index * 2 + 1 },
  ]);

  return pairedCards.sort(() => Math.random() - 0.5);
};

function GameContent({
  userName,
  isStart,
  setStart,
  finish,
  setFinish,
  difficulties,
  setDifficulties,
  updateHistory,
}) {
  const [moves, setMoves] = useState(0);
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(
    difficultiesSetting[difficulties].time
  );
  const getMoves = () => movesRef.current;
  const [allCards, setAllCards] = useState([]);
  const [cards, setCards] = useState([]);

  const timeLeftRef = useRef(difficultiesSetting[difficulties].time);
  const movesRef = useRef(0);

  const incrementMoves = () => {
    movesRef.current += 1;
  };

  useEffect(() => {
    if (location.pathname === "/solomode" && userName) {
      socket.emit("load_history", userName);

      socket.on("game_history", (history) => {
        updateHistory(history);
        console.log("Game history loaded:", history);
      });

      return () => {
        socket.off("game_history");
      };
    }
  }, [location.pathname, userName]);

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

    const finalMoves = movesRef.current; // ✅ Ensure latest move count
    console.log("Final Moves on Timeout:", finalMoves);

    const newHistory = { moves: finalMoves, time: 0, stat: "Lost" };
    updateHistory((prevHistory) => [...prevHistory, newHistory]);

    const gameData = {
      userName,
      moves: finalMoves, // ✅ Correct move count
      time: 0,
      stat: "Lost",
    };

    socket.emit("save_game", gameData);
  };

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

    updateHistory((prevHistory) => [
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

  return (
    <>
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
            <button onClick={backToStart} className="reset-btn">
              Back To Start
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GameContent;
