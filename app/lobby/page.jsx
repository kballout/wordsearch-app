"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import { io } from "socket.io-client";
let socket

export default function Lobby() {
  useEffect(() => {
    const socketInit = async() => {
      await fetch('/api/socket')
      socket = io('http://localhost:3000', {
        path: '/api/socket_io'
      })
      socket.connect()
      socket.on('connect', () => {
        console.log(socket.id);
      })
    }
    socketInit()
  },[])

  return (
    <div>
      <h1>Welcome to the Lobby</h1>
      <Link href={"/game"}>Start Game</Link>
    </div>
  );
}
