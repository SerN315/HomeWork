import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "../layouts/chatlayout.scss";

const socket = io("http://localhost:3001");

function Chat({ username, room, chatHistory }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [file, setFile] = useState(null);
  const currentUser = localStorage.getItem("username");

  const sendMessage = async (fileUrl = null, fileType = null) => {
    if (!message.trim() && !fileUrl) return; // Prevent empty messages

    const messageData = {
      id: uuidv4(),
      room,
      author: username,
      message: fileUrl ? null : message,
      fileUrl,
      fileType,
      time: new Date().toLocaleTimeString(),
    };

    setMessageList((list) => [...list, messageData]);
    await socket.emit("send_message", messageData);

    setMessage("");
    setFile(null); // Reset file after sending
  };

  const handleFileUpload = async () => {
    if (!file) {
      sendMessage(); // Send a text message if no file is selected
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        sendMessage(data.fileUrl, data.fileType);
      }
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  useEffect(() => {
    setMessageList(chatHistory);

    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [chatHistory]);

  return (
    <div className="chatZone">
      <div className="navTop">
        <div className="Info">
          <h1 className="idName">{room}</h1>
        </div>
      </div>
      <div className="messager_body">
        {messageList.map((msg) => (
          <div
            key={msg.id}
            className="TextContent"
            style={{
              alignItems: msg.author === currentUser ? "end" : "",
            }}
          >
            <span
              className="sender"
              style={{
                marginLeft: msg.author === currentUser ? "0" : "25px",
                marginRight: msg.author === currentUser ? "25px" : "0",
              }}
            >
              {msg.author}
            </span>
            {msg.fileUrl ? (
              msg.fileType.startsWith("image") ? (
                <img src={msg.fileUrl} alt="sent-file" className="chatImage" />
              ) : msg.fileType.startsWith("video") ? (
                <video controls className="chatVideo">
                  <source src={msg.fileUrl} type={msg.fileType} />
                </video>
              ) : (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  Download File
                </a>
              )
            ) : (
              <span className="aText">{msg.message}</span>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Say Something"
        value={message}
        className="inputBox"
        onChange={(e) => setMessage(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleFileUpload}>Send</button>
    </div>
  );
}

export default Chat;
