import Link from "next/link";
import React from "react";

export default function GameOver({ players, isHost, returnToLobby }) {
  return (
    <div className="flex flex-col items-center w-full mt-10">
      <h1 className="font-bold text-2xl">Game Over</h1>
      <div className="mt-10 basicContainer w-5/6 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Scoreboard</h2>
        <div className="mt-10 w-2/6 text-lg flex flex-col items-center">
        <table className="w-full text-left">
          <tbody>
          <tr className="border-b-2 border-b-slate-800">
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
            {players.map((player, index) => (
              <tr className="border-b-slate-800 border-b-2 h-10" key={player.socketId}>
                <td>{index+1}</td>
                <td>{player.username}</td>
                <td>{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {isHost && (
          <button onClick={() => returnToLobby()} className="basicBtn mt-20">Return To Lobby</button>
        )}
        </div>
      </div>
    </div>
  );
}
