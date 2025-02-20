import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Chat from "./features/chat";
const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]); // Store room list

  useEffect(() => {
    const hasVisited = localStorage.getItem("username");
    socket.emit("recent_rooms", JSON.parse(localStorage.getItem("rooms")));
    if (!hasVisited) {
      const enteredUsername = prompt(
        "Welcome to our app!",
        "Enter Your Username"
      );
      if (enteredUsername) {
        localStorage.setItem("username", enteredUsername);
        setUsername(enteredUsername);
      }
    } else {
      setUsername(hasVisited);
    }
  }, []);

  const handleRoomData = (data) => {
    console.log(data);
    setRooms(data);
  };
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      // Get the current list of rooms from local storage
      const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];

      // Check if the room is already in the list
      if (!storedRooms.includes(room)) {
        // Add the new room to the list and update local storage
        const updatedRooms = [...storedRooms, room];
        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      }
      socket.on("chat_history", (history) => {
        setChatHistory(history); // Store history when received
      });
    }
  };

  useEffect(() => {
    socket.on("valid_rooms", handleRoomData);
    return () => {
      socket.off("chat_history"); // Clean up listener
    };
  }, []);

  return (
    <>
      <div className="App">
        <h1>Join a Room</h1>
        <div className="container">
          <h2>
            Username: <span style={{ color: "red" }}>{username}</span>
          </h2>
          <input
            type="text"
            placeholder="RoomId"
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom} className="join_btn">
            Join a Room
          </button>
          <div className="room_list">
            <h3>Recent Rooms</h3>
            <ul>
              {rooms.map((room) => (
                <li
                  className="room"
                  key={room}
                  onClick={() => {
                    setRoom(room);
                    joinRoom();
                  }}
                >
                  {room}
                </li>
              ))}
            </ul>
          </div>
          {room && (
            <Chat
              socket={socket}
              username={username}
              room={room}
              chatHistory={chatHistory}
            ></Chat>
          )}
        </div>
      </div>
    </>
  );

  // return (
  //   <>
  //     <ul></ul>
  //     <input
  //       type="text"
  //       placeholder="message"
  //       value={message}
  //       onChange={(e) => setMessage(e.target.value)}
  //     />
  //     <button onClick={sendMessage}>Send</button>
  //   </>
  // );
}

export default App;
