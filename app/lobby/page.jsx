"use client";
import useSessionStore from "@/utils/store";
import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../components/ChatBox";
import { useRouter } from "next/navigation";
import Users from "../components/Users";
import { io } from "socket.io-client";
import useSocket from "../hooks/useSocket";

export default function Lobby() {
  const { username, socketId, currentRoom, isHost, changeRoom } =
    useSessionStore();
  const [users, setUsers] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renderStart, setRenderStart] = useState(false);
  const [roomId, setRoomId] = useState();
  const router = useRouter();
  useSocket();
  const socket = useRef();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault(); // Prevent default browser unload behavior
      if(!isHost){
        setUsers([])
        socket.current.emit('leave-room', {id: currentRoom, username: username})
      }
    };

    const handleUnload = (event) => {
      event.preventDefault()
      // Check if the page is being unloaded (tab closed, back button pressed, etc.)
      // Perform the redirect
      if (!isHost) {
        console.log('unload');
        socket.current.emit('leave-room', {id: currentRoom, username: username})
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);


    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);

    };
  }, [currentRoom, isHost, username]);

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      path: "/api/socket_io",
    });
    socket.current.on("connect", () => {
      if (isHost) {
        console.log("creating room");
        socket.current.emit("create-room", {
          id: socket.current.id,
          username: username,
        });
        changeRoom(socket.current.id);
        setRoomId(socket.current.id);
        setRenderStart(true);
        setUsers([username])
      } else {
        setRoomId(currentRoom);
        console.log("user joined room");
        socket.current.emit("join-room", {
          id: currentRoom,
          username: username,
        });
      }
      socket.current.on("userJoined", (data) => {
        setUsers(data);
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
    });

    return () => socket.current.off("connect");
  }, [socket]);

  const sendMessage = (newMessage) => {
    socket.current.emit("send-message", newMessage);
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(currentRoom);
  };

  const startGame = () => {
    router.push("/game");
  };

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div>
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
            {renderStart && (
              <button onClick={() => startGame()} className="basicBtn self-end">
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
