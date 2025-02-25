import { useState, useEffect, useRef } from "react";
import Timer from "../components/Timer";
import CardGrid from "../components/CardGrid";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { fetchCardsFromDB } from "../features/pullCards";

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

function MultiplayerGame() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [players, setPlayers] = useState([]);
  const [isInRoom, setIsInRoom] = useState(false);
  const [hostId, setHostId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const timeLeftRef = useRef(40);

  useEffect(() => {
    socket.on("room_update", ({ players = [], hostId }) => {
      setPlayers(players);
      setHostId(hostId);
    });
    socket.on("game_started", () => {
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
      socket.emit("start_game", roomId);
    }
  };

  const startNewGame = () => {
    if (allCards.length > 0) {
      setCards(generateCards(allCards, "easy")); // Default difficulty
      setTimeLeft(40);
      timeLeftRef.current = 40;
    }
  };

  return (
    <div>
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
      {userId === hostId && !gameStarted && (
        <button onClick={startGame}>Start Game</button>
      )}
      {gameStarted && (
        <div>
          <Timer
            timeLeft={timeLeft}
            onTimeUpdate={(t) => (timeLeftRef.current = t)}
          />
          <CardGrid cards={cards} />
        </div>
      )}
    </div>
  );
}

export default MultiplayerGame;
