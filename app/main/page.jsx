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

export default function Main() {
  const { socketId, username, changeRoom, changeIsHost, changeSocketId, isHost, currentRoom } =
    useSessionStore();
  const [choice, setChoice] = useState("main");
  const [players, setPlayers] = useState([{username: 'kassim', socketId: '1', score: '6'},{username: 'ahmad', socketId: '2', score: '4'},{username: 'snake', socketId: '3', score: '2'}]);
  const [roomId, setRoomId] = useState();
  const [returning, setReturning] = useState(false)
  let socket = useRef();
  useSocket();

  useEffect(() => {
    socket.current = io("http://localhost:3000", {
      path: "/api/socket_io",
    });

    socket.current.on("connect", () => {
      changeSocketId(socket.current.id)
    });

    socket.current.on('returnToLobby', () => {
      console.log('change choice');
      setChoice('lobby')
    })

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

  function endGame(users){
    users.sort((a,b) => b.score - a.score)
    setPlayers(users)
    setChoice('gameOver')
  }

  function leaveLobby(){
    if(isHost){
      socket.current.emit("close-room", { id: currentRoom });
    } else {
      setPlayers([]);
      socket.current.emit("leave-room", {
        id: currentRoom,
        username: username,
        socketId: socket.current.id,
      });
      onReload()
    }
  }

  function returnToLobby(){
    setReturning(true)
    socket.current.emit('return-to-lobby', {currentRoom: socket.current.id})
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
          <Lobby onReload={onReload} startGame={startGame} roomId={roomId} socket={socket} returning={returning} leaveLobby={leaveLobby} />
        )}
        {choice === "game" && <Game users={players} socket={socket.current} endGame={endGame} />}
        {choice === 'gameOver' && <GameOver players={players} isHost={isHost} returnToLobby={returnToLobby}/>}
      </main>
    </div>
  );
}
