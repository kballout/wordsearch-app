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
      <p className="text-xl mb-5">Have a game ID? Input the ID and click join</p>
      <form className="w-full flex flex-col items-center" onSubmit={(e) => joinLobby(e, joinId.current.value)}>
        <div className="flex gap-1">
          <input className="basicInput" ref={joinId} type="text" placeholder="Game ID" required />
          <input className="submitBtn" type="submit" value={"Join"} />
        </div>
      </form>
      <p className="text-xl mt-20">Or create a new lobby</p>
      <button className="basicBtn mt-3" onClick={() => createLobby()}>Create Lobby</button>
    </div>
  );
}
