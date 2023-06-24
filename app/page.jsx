import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Have a game ID? Input the ID and click join</p>
      <form>
        <input
          type='text'
          placeholder='Game ID'
        />
        <input
          type='submit'
        />
      </form>
      <Link href={"/lobby"}>Create Lobby</Link>
    </div>
  )
}
