"use client";
import useSessionStore from "@/utils/store";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const ChatBox = ({messages, sendMessage, color}) => {
  const [inputMessage, setInputMessage] = useState("");
  const messagesContainerRef = useRef(null);

  const { username, currentRoom } = useSessionStore();

 

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim() !== "") {
      let newMessage = {
        author: username,
        message: inputMessage.trim(),
        currentRoom: currentRoom,
        color: color || "bg-white"
      };
      sendMessage(newMessage)
      setInputMessage("");
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container when new messages are added
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-96 border-slate-800 border bg-orange-100 rounded-md p-4">
      <div
        ref={messagesContainerRef}
        className="flex flex-col flex-grow overflow-y-auto"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col mb-2 p-2 rounded-md ${message.color}`}
          >
            <p className="text-gray-800 font-bold">{message.author}</p>
            <p className="text-gray-700">{message.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => handleSendMessage(e)} className="flex">
        <input
          type="text"
          className="flex-grow p-2 rounded-l-md border border-gray-300 focus:outline-none"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={handleInputChange}
        />
        <input
          className="submitBtn w-1/12"
          type="submit"
          value={"Send"}
        />
      </form>
    </div>
  );
};

export default ChatBox;
