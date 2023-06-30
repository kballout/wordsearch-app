"use client";
import useSessionStore from "@/utils/store";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";

export default function Home() {
  const { changeUsername, changeSocketId } = useSessionStore();
  const router = useRouter();
  const username = useRef();

  async function login(e) {
    e.preventDefault();
    await fetch("/api/socket");
    changeUsername(username.current.value);
    router.push("/main");
  }
  return (
    <div>
      <h1>Welcome</h1>
      <p>Enter a username to start</p>
      <form onSubmit={(e) => login(e)}>
        <input ref={username} type="text" required />
        <input type="submit" />
      </form>
    </div>
  );
}
