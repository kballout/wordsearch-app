"use client";
import useSessionStore from "@/utils/store";
import React, { useEffect, useRef, useState } from "react";
import ChatBox from "../ChatBox";
import { useRouter } from "next/navigation";
import Users from "../Users";
import { toast } from "react-toastify";

export default function Lobby({ startGame, roomId, socket, returning = false, leaveLobby, users, messages }) {
  const { username, socketId, currentRoom, isHost, changeRoom } =
    useSessionStore();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault()
  //     console.log('event');
  //     if (!isHost) {
  //       leaveLobby()
  //     } else {
  //       socket.current.emit("close-room", { id: currentRoom });
  //     }
  //   };

  //   const shortcutInput = (event) => {
  //     if (event.altKey && event.key === "ArrowLeft") {
  //       console.log('event');
  //       if (!isHost) {
  //         leaveLobby()
  //       } else {
  //         socket.current.emit("close-room", { id: currentRoom });
  //       }
  //     }
  //   }

  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   window.addEventListener("popstate", handleBeforeUnload);
  //   window.addEventListener("keydown", shortcutInput)
  //   // window.addEventListener("unload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     window.removeEventListener("popstate", handleBeforeUnload);
  //     window.removeEventListener("keydown", shortcutInput);
  //     // window.removeEventListener("unload", handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    if (!returning) {
      if (isHost) {
        console.log("creating room");
        socket.current.emit("create-room", {
          id: socket.current.id,
          username: username,
        });
      } else {
        console.log("joining room");
        socket.current.emit("join-room", {
          id: roomId,
          username: username,
          socketId: socket.current.id,
        });
      }
    }
  }, []);

  const sendMessage = (newMessage) => {
    socket.current.emit("send-message", newMessage);
  };

  const handleCopyId = async () => {
    await navigator.clipboard.writeText(currentRoom);
    toast.success("ID has been copied!", { autoClose: 2000, theme: 'dark' })
  };

  const beginGame = () => {
    startGame(users);
    socket.current.emit("start-game");
  };

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="w-full">
        <h1 className="text-center font-bold mt-3 text-2xl">Welcome</h1>
        <header className="mt-4 flex flex-col items-center">
          <div className="flex gap-2 w-2/6 justify-center items-center">
            <p className="text-lg">Room ID:</p>
            <input
              className=" basicInput text-center text-lg"
              type="text"
              readOnly
              defaultValue={roomId}
            />
            <button
              className="basicBtn"
              type="button"
              onClick={() => handleCopyId()}
            >
              Copy ID
            </button>
          </div>
        </header>
        <main className="mt-3 flex justify-center">
          <div className="w-5/6 basicContainer">
            <div className="mt-5 flex gap-16 items-start ">
              <div className="w-1/6">
                <Users users={users} />
              </div>
              <div className="w-4/6">
                <ChatBox messages={messages} sendMessage={sendMessage} color={'bg-white'} />
              </div>
              <div className="flex items-center justify-center gap-5 w-1/6 mr-10">
                {roomId === socket.current.id && (
                  <button onClick={() => beginGame()} className="basicBtn">
                    Start Game
                  </button>
                )}
                <button onClick={() => leaveLobby()} className="basicBtn">
                  {isHost ? "End Lobby" : "Leave Lobby"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
