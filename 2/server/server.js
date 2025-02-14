const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // Ensure you have this file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", async (room) => {
    socket.join(room);
    console.log(`User with ID:${socket.id} joined room:${room}`);

    // Fetch previous chat messages from Firestore
    const messagesRef = db.collection("rooms").doc(room).collection("messages");
    const snapshot = await messagesRef.orderBy("timestamp").get();

    let messages = [];
    snapshot.forEach((doc) => {
      messages.push(doc.data());
    });

    // Send chat history to the user
    socket.emit("chat_history", messages);
  });

  socket.on("send_message", async (data) => {
    const { id, room, message, author } = data;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Store message in Firestore
    await db.collection("rooms").doc(room).collection("messages").add({
      id,
      author,
      message,
      timestamp,
    });

    // Send message to other users in the room
    socket.to(room).emit("receive_message", {
      id,
      author,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("listening on port 3001");
});
