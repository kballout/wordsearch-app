"use client";
import useSessionStore from "@/utils/store";
import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../ChatBox";
import { useRouter } from "next/navigation";
import Users from "../Users";


export default function Lobby({
  onReload,
  startGame,
  roomId,
  socket,
}) {
  const { username, socketId, currentRoom, isHost, changeRoom } =
    useSessionStore();
  const [users, setUsers] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isHost) {
        setUsers([]);
        socket.current.emit("leave-room", {
          id: currentRoom,
          username: username,
          socketId: socket.current.id,
        });
      } else {
        socket.current.emit("close-room", { id: currentRoom });
        onReload();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBeforeUnload);
    // window.addEventListener("unload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBeforeUnload);
      // window.removeEventListener("unload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isHost) {
      console.log("creating room");
      socket.current.emit("create-room", {
        id: socket.current.id,
        username: username,
      });
      setUsers([
        {
          username: username,
          socketId: socket.current.id,
        },
      ]);
    } else {
      console.log("joining room");
      socket.current.emit("join-room", {
        id: roomId,
        username: username,
        socketId: socket.current.id,
      });
    }
  }, []);


  socket.current.on("userJoined", (data) => {
    setUsers(data);
  });
  socket.current.on("roomClosed", () => {
    onReload();
  });
  socket.current.on("receive-message", (data) => {
    if (data.author !== username) {
      const newMessage = {
        author: data.author,
        message: data.message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } else {
      const newMessage = {
        author: "You",
        message: data.message,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  });
  socket.current.on('gameStart', (data) => {
    startGame(data)
  })

  const sendMessage = (newMessage) => {
    socket.current.emit("send-message", newMessage);
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(currentRoom);
  };

  const beginGame = () => {
    startGame(users)
    socket.current.emit('start-game')
  }

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="w-full">
        <h1 className="text-center font-bold mt-3 text-2xl">Welcome</h1>
        <header className="mt-4 flex flex-col items-center">
          <p className="text-lg">Share The Room ID</p>
          <div className="flex gap-2 w-2/6 justify-center items-center">
            <input
              className="mt-2 basicInput text-center text-lg"
              type="text"
              readOnly
              defaultValue={roomId}
            />
            <button
              className="basicBtn"
              type="button"
              onClick={() => handleCopyId()}
            >
              Copy ID
            </button>
          </div>
        </header>
        <main className="mt-3 flex justify-center">
          <div className="w-5/6 basicContainer flex flex-col">
            {roomId === socket.current.id && (
              <button
                onClick={() => beginGame()}
                className="basicBtn self-end"
              >
                Start Game
              </button>
            )}
            <div className="mt-5 flex justify-center gap-16 items-start">
              <div className="w-1/6">
                <Users users={users} />
              </div>
              <div className="w-4/6">
                <ChatBox messages={messages} sendMessage={sendMessage} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
