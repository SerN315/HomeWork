const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Ensure you have this file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const rooms = {}; // Ensures rooms is always an object

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Save game history in Firebase
  socket.on("save_game", async (data) => {
    try {
      const { userName, moves, time, stat } = data;
      await db.collection("gameHistory").add({
        userName,
        moves,
        time,
        stat,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Game history saved:", data);
    } catch (error) {
      console.error("Error saving game history:", error);
    }
  });

  // Create or Join a Room
  socket.on("join_room", ({ roomId, userName }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [], gameStarted: false, hostId: socket.id };
    }

    rooms[roomId].players.push({
      id: socket.id,
      userName,
      time: null,
      moves: null,
      time: null,
      stat: "Playing",
    });

    socket.join(roomId);
    socket.emit("user_data", { userId: socket.id });

    io.to(roomId).emit("room_update", {
      players: rooms[roomId].players,
      hostId: rooms[roomId].hostId,
    });
  });

  socket.on("start_game", ({ roomId, difficulties }) => {
    if (rooms[roomId] && rooms[roomId].hostId === socket.id) {
      rooms[roomId].gameStarted = true;
      rooms[roomId].difficulties = difficulties; // ✅ Store difficulty
      io.to(roomId).emit("game_started", difficulties); // ✅ Send difficulty to all
    }
  });

  socket.on("player_finished", async ({ roomId, userName, time, moves }) => {
    const room = rooms[roomId];
    if (!room) return;

    console.log(`📩 ${userName} finished the game with ${time} seconds`);

    if (time === undefined) time = 0; // Default to 0 if undefined
    if (moves === undefined) moves = Number.MAX_SAFE_INTEGER; // Default worst case for lost players

    // ✅ Prioritize current game data
    let latestHistoryEntry = {
      time,
      moves,
      stat: time === 0 ? "Lost" : "Completed",
    };

    // ✅ Fetch latest history entry from Firebase
    const playerHistory = await fetchGameHistory(userName);
    if (playerHistory.length > 0 && playerHistory[0].time !== undefined) {
      latestHistoryEntry = playerHistory[0]; // ✅ Get most recent entry
    }

    // ✅ Update the player's status with correct data
    const player = room.players.find((p) => p.userName === userName);
    if (player) {
      player.time = time; // Use the current game time
      player.moves = moves; // Use the current game moves
      player.stat = time === 0 ? "Lost" : "Completed"; // Mark lost if time is 0
    }

    // ✅ Only rank players who have completed
    const finishedPlayers = room.players.filter(
      (p) => p.stat === "Completed" || p.stat === "Lost"
    );

    const rankedPlayers = finishedPlayers
      .map((p) => ({
        userName: p.userName,
        time: p.time,
        moves: p.moves,
        stat: p.stat,
      }))
      .sort((a, b) => {
        if (a.time === 0 && b.time === 0) return a.moves - b.moves; // ✅ Sort "Lost" players by moves
        return a.time - b.time || a.moves - b.moves; // ✅ Otherwise, rank by time then moves
      });

    console.log("🏆 Updated Rankings:", rankedPlayers);
    io.to(roomId).emit("update_rankings", rankedPlayers);

    // ✅ Check if ALL players have finished
    if (finishedPlayers.length === room.players.length) {
      console.log("🎮 All players finished! Sending final rankings...");
      io.to(roomId).emit("game_over", rankedPlayers);

      // ✅ Reset room state so it can be reused
      rooms[roomId].gameStarted = false;
      rooms[roomId].players.forEach((p) => {
        p.time = null;
        p.moves = null;
        p.stat = "Playing";
      });
    }
  });

  // Fetch Game History
  socket.on("load_history", async (userName) => {
    try {
      const history = await fetchGameHistory(userName);
      socket.emit("game_history", history);
    } catch (error) {
      console.error("Error loading game history:", error);
    }
  });

  // Leave Room
  socket.on("leave_room", ({ roomId, userName }) => {
    if (!rooms[roomId]) return;

    const room = rooms[roomId];
    room.players = room.players.filter((p) => p.id !== socket.id);

    // Assign a new host if the host leaves
    if (room.hostId === socket.id && room.players.length > 0) {
      room.hostId = room.players[0].id;
      io.to(roomId).emit("new_host", room.players[0].userName);
    }

    // Notify remaining players
    io.to(roomId).emit("room_update", {
      players: room.players,
      hostId: room.hostId,
    });

    // Delete room if empty
    if (room.players.length === 0) {
      delete rooms[roomId];
    }

    console.log(`${userName} left room ${roomId}`);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    let roomIdToRemove = null;
    let removedPlayer = null;

    for (let roomId in rooms) {
      const room = rooms[roomId];

      // Find and remove the player
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        removedPlayer = room.players.splice(playerIndex, 1)[0];

        io.to(roomId).emit("player_disconnected", socket.id);
      }

      // Assign a new host if the host disconnects
      if (room.hostId === socket.id && room.players.length > 0) {
        room.hostId = room.players[0].id;
        io.to(roomId).emit("new_host", room.players[0].userName);
      }

      io.to(roomId).emit("room_update", {
        players: room.players,
        hostId: room.hostId,
      });

      // Mark room for deletion if empty
      if (room.players.length === 0) {
        roomIdToRemove = roomId;
      }
    }

    // Delete empty room
    if (roomIdToRemove) {
      delete rooms[roomIdToRemove];
    }

    if (removedPlayer) {
      console.log(
        `User ${removedPlayer.userName} disconnected from room ${roomIdToRemove}.`
      );
    } else {
      console.log(`User ${socket.id} disconnected.`);
    }
  });
});

const fetchGameHistory = async (userName) => {
  try {
    const querySnapshot = await db
      .collection("gameHistory")
      .where("userName", "==", userName)
      .orderBy("timestamp", "desc")
      .get();
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching game history:", error);
    return [];
  }
};

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
