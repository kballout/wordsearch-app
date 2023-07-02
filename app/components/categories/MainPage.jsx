"use client"
import useSessionStore from "@/utils/store";
import React, { useEffect, useRef, useState } from "react";

export default function MainPage({createLobby, joinLobby}) {
  const joinId = useRef();
  const { username} = useSessionStore();
  const [name, setName] = useState()

  useEffect(() => {
    setName(username)
  },[username])


  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold my-10">Welcome {name}</h1>
      <p>Have a game ID? Input the ID and click join</p>
      <form onSubmit={(e) => joinLobby(e, joinId.current.value)}>
        <input ref={joinId} type="text" placeholder="Game ID" required />
        <input type="submit" />
      </form>
      <button onClick={() => createLobby()}>Create Lobby</button>
    </div>
  );
}
