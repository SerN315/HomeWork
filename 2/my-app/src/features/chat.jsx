import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
import { v4 as uuidv4 } from "uuid";

function Chat({ socket, username, room, chatHistory }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

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
      <div>
        {messageList.map((messageContent) => {
          return (
            <h2 key={messageContent.id}>
              <span>{messageContent.author}</span>: {messageContent.message}
            </h2>
          );
        })}
      </div>
      <input
        type="text"
        placeholder="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}

export default Chat;
