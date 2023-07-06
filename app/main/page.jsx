"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import useSessionStore from "../../utils/store";
import { useRouter } from "next/navigation";
import MainPage from "../components/categories/MainPage";
import Lobby from "../components/categories/Lobby";
import Game from "../components/categories/Game";
import { io } from "socket.io-client";
import useSocket from "../hooks/useSocket";
import GameOver from "../components/categories/GameOver";
import { toast } from "react-toastify";

export default function Main() {
  const {
    socketId,
    username,
    changeRoom,
    changeIsHost,
    changeSocketId,
    isHost,
    currentRoom,
  } = useSessionStore();
  const [choice, setChoice] = useState("main");
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([])
  const [roomId, setRoomId] = useState();
  const [returning, setReturning] = useState(false);
  let socket = useRef();
  useSocket();

  //listeners
  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      path: "/api/socket_io",
    });

    socket.current.on("connect", () => {
      changeSocketId(socket.current.id);
    });

    socket.current.on("returnToLobby", () => {
      setReturning(true);
      setChoice("lobby");
    });

    socket.current.on("validLobby", (data) => {
      changeRoom(data.id);
      changeIsHost(false);
      setRoomId(data.id);
      setChoice("lobby");
    });

    socket.current.on('gameAlreadyStarted', () => {
      toast.error('The game is already in session', {autoClose: 2000, theme: 'dark'})
    })

    socket.current.on("errorJoining", () => {
      toast.error("The ID is invalid!", { autoClose: 2000, theme: "dark" });
    });

    //lobby
    socket.current.on("userJoined", (data) => {
      setPlayers(data.arr);
      if(data.data.socketId !== socket.current.id){
        toast.success(`${data.data.username} has joined the lobby`, {autoClose: 2000, theme: 'dark'})
      }
    });
    socket.current.on('userLeft', (data) => {
      toast.success(`${data.data.username} has left the lobby`, {autoClose: 2000, theme: 'dark'})
      setPlayers(data.arr);
    })
    socket.current.on("roomClosed", () => {
      onReload();
    });
    socket.current.on("receive-message", (data) => {
      if (data.author !== username) {
        const newMessage = {
          author: data.author,
          message: data.message,
          color: data.color
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        const newMessage = {
          author: "You",
          message: data.message,
          color: data.color
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    socket.current.on("gameStart", (data) => {
      startGame(data);
    });


    return () => socket.current.off("connect");
  }, [socket]);

  function joinLobby(e, id) {
    e.preventDefault();
    if (id) {
      socket.current.emit("check-room", { id: id });
    }
  }

  function createLobby() {
    changeIsHost(true);
    changeRoom(socket.current.id);
    setRoomId(socket.current.id);
    setPlayers([
      {
        username: username,
        socketId: socket.current.id,
      },
    ]);
    setChoice("lobby");
  }

  function onReload() {
    changeRoom("");
    setReturning(false)
    setPlayers([])
    setMessages([])
    setChoice("main");
  }

  function startGame(users) {
    setPlayers(users);
    setChoice("game");
  }

  function endGame(users) {
    users.sort((a, b) => b.score - a.score);
    setPlayers(users);
    setChoice("gameOver");
  }

  function leaveLobby() {
    if (isHost) {
      socket.current.emit("close-room", { id: currentRoom });
    } else {
      socket.current.emit("leave-room", {
        id: currentRoom,
        username: username,
        socketId: socket.current.id,
      });
      onReload();
    }
  }

  function returnToLobby() {
    socket.current.emit("return-to-lobby", { currentRoom: socket.current.id });
  }

  return (
    <div className="flex flex-col items-center w-full">
      <header>
        <Link href={"/"} className="font-bold text-3xl mt-12">
          Word Search Online
        </Link>
      </header>
      <main className="w-full">
        {choice === "main" && (
          <MainPage
            joinLobby={joinLobby}
            createLobby={createLobby}
            username={username}
          />
        )}
        {choice === "lobby" && (
          <Lobby
            startGame={startGame}
            roomId={roomId}
            socket={socket}
            returning={returning}
            users={players}
            leaveLobby={leaveLobby}
            messages={messages}
          />
        )}
        {choice === "game" && (
          <Game users={players} socket={socket.current} endGame={endGame} leaveLobby={leaveLobby} messages={messages} />
        )}
        {choice === "gameOver" && (
          <GameOver
            players={players}
            isHost={isHost}
            returnToLobby={returnToLobby}
          />
        )}
      </main>
    </div>
  );
}
