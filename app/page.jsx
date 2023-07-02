"use client";
import useSessionStore from "@/utils/store";
import Link from "next/link";
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
    <div className="flex flex-col items-center">
      <header className="mt-16">
        <div>
          <Link href={"/"} className="text-3xl font-bold">Word Search Online</Link>
        </div>
      </header>
      <main className="mt-10 flex flex-col items-center">
        <h1 className="text-2xl mb-10">Welcome</h1>
        <p>Enter a username to start</p>
        <form onSubmit={(e) => login(e)}>
          <input ref={username} type="text" required />
          <input type="submit" />
        </form>
      </main>
    </div>
  );
}
