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

// Multer storage setup for local uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Serve uploaded files as static assets
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("recent_rooms", async (recentRooms) => {
    if (!recentRooms || recentRooms.length === 0) return; // Don't proceed if no rooms are provided

    try {
      const roomsSnapshot = await db.collection("rooms").listDocuments();
      const allRooms = roomsSnapshot.map((doc) => doc.id);

      // Filter only valid rooms that exist in Firestore
      const validRooms = recentRooms.filter((room) => allRooms.includes(room));

      console.log("Valid Rooms Fetched:", validRooms); // Debugging log
      socket.emit("valid_rooms", validRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  });

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
    const { id, room, message, author, fileUrl, fileType } = data;
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    // Store message in Firestore
    await db
      .collection("rooms")
      .doc(room)
      .collection("messages")
      .add({
        id,
        author,
        message: message || null,
        fileUrl: fileUrl || null,
        fileType: fileType || null,
        timestamp,
      });

    // Send message to other users in the room
    socket.to(room).emit("receive_message", {
      id,
      author,
      message,
      fileUrl,
      fileType,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// API endpoint to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  res.json({ success: true, fileUrl, fileType: req.file.mimetype });
});

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
