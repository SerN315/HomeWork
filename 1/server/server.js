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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Save game history under the username
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

  // Fetch game history when user loads the page
  socket.on("load_history", async (userName) => {
    try {
      const history = await fetchGameHistory(userName);
      socket.emit("game_history", history);
    } catch (error) {
      console.error("Error loading game history:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
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
