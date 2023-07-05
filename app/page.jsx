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
      <header className="mt-12">
        <div>
          <Link href={"/"} className="text-3xl font-bold">
            Word Search Online
          </Link>
        </div>
      </header>
      <main className="mt-10 flex flex-col items-center">
        <h1 className="text-2xl mb-10 font-bold">Welcome</h1>
        <p className="text-xl mb-2">Enter your username</p>
        <form onSubmit={(e) => login(e)}>
        <div className="flex flex-col items-center">
          <input
            className="basicInput text-lg"
            ref={username}
            type="text"
            required
          />
          <div>
            <input className="mt-5 basicBtn text-lg" type="submit" value={"Enter"} />
          </div>
        </div>
        </form>
      </main>
    </div>
  );
}
