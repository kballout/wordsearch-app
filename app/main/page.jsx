"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import useSessionStore from "../../utils/store";
import { useRouter } from "next/navigation";

export default function Main() {
  const { socketId, username, changeRoom, changeIsHost, changeSocketId } = useSessionStore();
  const joinId = useRef();
  const router = useRouter();


  function joinLobby(e) {
    e.preventDefault();
    changeRoom(joinId.current.value);
    changeIsHost(false);
    router.push("/lobby");
  }

  function createLobby() {
    changeIsHost(true);
    router.push("/lobby");
  }

  return (
    <div>
      <h1>Welcome</h1>
      <p>Have a game ID? Input the ID and click join</p>
      <form onSubmit={(e) => joinLobby(e)}>
        <input ref={joinId} type="text" placeholder="Game ID" required />
        <input type="submit" />
      </form>
      <button onClick={() => createLobby()}>Create Lobby</button>
    </div>
  );
}
