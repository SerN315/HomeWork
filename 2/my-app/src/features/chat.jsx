import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
import { v4 as uuidv4 } from "uuid";
import "../layouts/chatlayout.scss";

function Chat({ socket, username, room, chatHistory }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const currentUser = localStorage.getItem("username");
  const sendMessage = async () => {
    if (message.trim() !== "") {
      const messageData = {
        id: uuidv4(),
        room: room,
        author: username,
        message: message,
        time:
          new Date(Date.now()).getHours + ":" + new Date(Date.now()).getMinutes,
      };
      setMessageList((list) => [...list, messageData]);

      await socket.emit("send_message", messageData);
      setMessage(""); // Clear input field after sending
    }
  };

  useEffect(() => {
    setMessageList(chatHistory); // Load history when joining

    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatHistory]);

  return (
    <>
      <div className="chatZone">
        <div className="navTop">
          {/* <div className="back-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
          </div> */}
          <div className="Info">
            <h1 className="idName">{room}</h1>
          </div>
        </div>
        <div className="messager_body">
          {messageList.map((messageContent) => {
            return (
              <div
                key={messageContent.id}
                className="TextContent"
                style={{
                  alignItems: messageContent.author == currentUser ? "end" : "",
                }}
              >
                <span
                  className="sender"
                  style={{
                    marginLeft:
                      messageContent.author == currentUser ? "0" : "25px",
                    marginRight:
                      messageContent.author == currentUser ? "25px" : "0",
                  }}
                >
                  {messageContent.author}
                </span>
                <span className="aText">{messageContent.message}</span>
              </div>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Say Something"
          value={message}
          className="inputBox"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </>
  );
}

export default Chat;
