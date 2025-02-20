import React, { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import EmojiPicker from "emoji-picker-react"; // Import emoji picker
import "../layouts/chatlayout.scss";

const socket = io("http://localhost:3001");

function Chat({ username, room, chatHistory }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const currentUser = localStorage.getItem("username");

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

  const sendMessage = useCallback(
    async (fileUrl = null, fileType = null) => {
      if (!message.trim() && !fileUrl) return;

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
      setFile(null);
    },
    [message, room, username]
  );

  const handleFileUpload = async () => {
    if (!file) {
      sendMessage();
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

  const handleInputChange = (e) => {
    const { type, files, value } = e.target;
    if (type === "file") {
      setFile(files[0]);
      setMessage(files[0]?.name || "");
    } else {
      setMessage(value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFileUpload(); // Send message or file
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.kind === "file") {
        const pastedFile = item.getAsFile();
        setFile(pastedFile);
        setMessage(pastedFile.name);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setMessage(droppedFile.name);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const renderMessage = (msg) => {
    if (msg.fileUrl) {
      return msg.fileType.startsWith("image") ? (
        <img src={msg.fileUrl} alt="sent-file" className="chatImage" />
      ) : msg.fileType.startsWith("video") ? (
        <video controls className="chatVideo">
          <source src={msg.fileUrl} type={msg.fileType} />
        </video>
      ) : (
        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
          Download File
        </a>
      );
    } else if (msg.message?.match(/https?:\/\/[^\s]+/)) {
      return msg.message.split(" ").map((word, index) =>
        word.match(/https?:\/\/[^\s]+/) ? (
          <span className="aText">
            <a
              key={index}
              href={word}
              target="_blank"
              rel="noopener noreferrer"
              className="message-link"
            >
              {word}
            </a>
          </span>
        ) : (
          `${word}`
        )
      );
    } else {
      return <span className="aText">{msg.message}</span>;
    }
  };

  return (
    <div
      className="chatZone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onPaste={handlePaste}
    >
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
            {renderMessage(msg)}
          </div>
        ))}
      </div>

      <div className="chatInputContainer">
        <button onClick={() => setShowEmojiPicker((prev) => !prev)}>
          {" "}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>{" "}
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
        <button onClick={handleChooseFile}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Type a message or paste/drag media"
          value={message}
          className="inputBox"
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleFileUpload}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Chat;
