import { useState, useEffect, useRef } from "react";
import Timer from "../components/timer";
import CardGrid from "../components/cardGrid";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { fetchCardsFromDB } from "../features/pullCards";
import GameContent from "../components/gameLogic";
import GameHistory from "../components/history";
import RankingBoard from "../components/Ranking";
import Difficulties from "../components/Difficulites";
import { generateCards } from "../utils/gameUltis";
import "../App.css";

const socket = io("http://localhost:3001");

function MultiplayerGame() {
  const navigate = useNavigate();
  const [difficulties, setDifficulties] = useState("easy");
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [players, setPlayers] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [hostId, setHostId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [allFinished, setAllFinished] = useState(false);
  const [finish, setFinish] = useState(false);
  const [history, setHistory] = useState([]); // ✅ Track game history

  useEffect(() => {
    socket.on("update_rankings", (rankedPlayers) => {
      console.log("📊 Rankings updated:", rankedPlayers);
      setRankings(rankedPlayers);
    });

    socket.on("game_over", (finalRankings) => {
      setRankings(finalRankings);
      setAllFinished(true);
    });

    return () => {
      socket.off("update_rankings");
      socket.off("game_over");
    };
  }, []);

  useEffect(() => {
    socket.on("room_update", ({ players = [], hostId }) => {
      setPlayers(players);
      setHostId(hostId);
    });

    socket.on("game_started", (difficulties) => {
      setDifficulties(difficulties); // ✅ Sync difficulty
      setGameStarted(true);
      startNewGame();
    });

    socket.on("user_data", ({ userId }) => {
      setUserId(userId);
    });

    socket.on("player_disconnected", (disconnectedPlayerId) => {
      setPlayers((prev) => prev.filter((p) => p.id !== disconnectedPlayerId));
    });

    return () => {
      if (roomId) {
        socket.emit("leave_room", { roomId, userName });
      }
      socket.off("room_update");
      socket.off("player_disconnected");
      socket.off("game_started");
    };
  }, [roomId, userName]);

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

  const joinRoom = () => {
    if (!roomId.trim()) return;
    socket.emit("join_room", { roomId, userName });
    setIsInRoom(true);
  };

  const startGame = () => {
    if (userId === hostId) {
      socket.emit("start_game", { roomId, difficulties }); // ✅ Send difficulty to server
      setGameStarted(true);
      startNewGame();
    }
  };

  const startNewGame = () => {
    if (allCards.length > 0) {
      setFinish(false); // Reset finish state
      setAllFinished(false);
    }
  };

  const handleGameFinish = (moves, timeLeft) => {
    setFinish(true);
    // ✅ Send both moves and timeLeft to the server
    socket.emit("player_finished", { roomId, userName, moves, timeLeft });
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Multiplayer Mode</h2>
      {!isInRoom ? (
        <>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <div className="user_list_container">
          <h3>Lobby</h3>
          <ul className="user_list">
            {players.map((player) => (
              <li key={player.id}>
                {player.userName} {player.id === hostId && "(Host)"}
              </li>
            ))}
          </ul>
        </div>
      )}
      {userId === hostId && !gameStarted && isInRoom && (
        <div>
          <Difficulties
            difficulties={difficulties}
            handleDifficultyChange={(event) =>
              setDifficulties(event.target.value)
            }
            isStart={gameStarted}
          />
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {finish ? (
        !allFinished ? (
          <div className="waitingScreen">
            <h2>Waiting for other players to finish...</h2>
          </div>
        ) : (
          <>
            <RankingBoard userName={userName} rankings={rankings} />
          </>
        )
      ) : (
        <GameContent
          userName={userName}
          isStart={gameStarted}
          setStart={setGameStarted}
          finish={finish}
          setFinish={handleGameFinish} // ✅ Pass finish handler
          difficulties={difficulties}
          setDifficulties={setDifficulties}
          updateHistory={setHistory} // ✅ Track moves in history
        />
      )}
    </div>
  );
}

export default MultiplayerGame;
