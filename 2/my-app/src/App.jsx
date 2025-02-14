import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Chat from "./features/chat";
const socket = io("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState("");
  useEffect(() => {
    const hasVisited = localStorage.getItem("username");

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
  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);

      socket.on("chat_history", (history) => {
        setChatHistory(history); // Store history when received
      });
    }
  };

  useEffect(() => {
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
