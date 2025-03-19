"use client"

import { useEffect, useState } from "react";
import User from "./components/User"
import { redirect } from "next/navigation";

export default function Home() {
  const [ accessToken, setAccessToken ] = useState('');
  useEffect( () => {
    if ( !accessToken ) {
      redirect( '/auth' );
    }
  }, [] );

  return (
    <main>
      <User />
      <h1>Overlappr</h1>
    </main>
  );
}
