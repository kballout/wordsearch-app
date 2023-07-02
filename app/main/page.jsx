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

export default function Main() {
  const { socketId, username, changeRoom, changeIsHost, changeSocketId, isHost } =
    useSessionStore();
  const [choice, setChoice] = useState("main");
  const [players, setPlayers] = useState([]);
  const [roomId, setRoomId] = useState();
  const router = useRouter();
  let socket = useRef();
  useSocket();

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      path: "/api/socket_io",
    });

    socket.current.on("connect", () => {
      changeSocketId(socket.current.id)
    });

    return () => socket.current.off("connect");
  }, [socket]);

  function joinLobby(e, id) {
    e.preventDefault();
    if (id) {
      changeRoom(id);
      changeIsHost(false);
      setRoomId(id);
      setChoice("lobby");
    }
  }

  function createLobby() {
    changeIsHost(true);
    changeRoom(socket.current.id);
    setRoomId(socket.current.id)
    setChoice("lobby");
  }

  function onReload() {
    setChoice("main");
  }

  function startGame(users) {
    setPlayers(users);
    setChoice("game");
  }

  return (
    <div className="flex flex-col items-center w-full">
      <header>
        <Link href={"/"} className="font-bold text-3xl mt-16">
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
          <Lobby onReload={onReload} startGame={startGame} roomId={roomId} socket={socket} />
        )}
        {choice === "game" && <Game players={players} socket={socket.current} />}
      </main>
    </div>
  );
}
