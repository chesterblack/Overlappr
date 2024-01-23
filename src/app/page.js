"use client"

import { useEffect, useState } from "react";
import PlaylistSelect from "./components/PlaylistSelect";
import { MainContext } from "./context/main-context";

export default function Home() {  
  const [ token, setToken ] = useState("");
  const [ playlists, setPlaylists ] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&")
        .find(elem => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";

  return (
    <MainContext.Provider value={{ token }}>
      <div className="overlappr">

        {token &&
          <button
            className="log-out"
            onClick={() => {
              setToken("");
              window.localStorage.removeItem("token");
            }}
          >
            Log out
          </button>
        }

        <main>
          <div className="center">
            <h1>Overlappr</h1>
            {!token &&
              <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}`}>
                Login to Spotify
              </a>
            }
            {token &&
            <>
              <button>
                Create new playlist
              </button>
              <PlaylistSelect />
            </>
            }
          </div>
        </main>
      </div>
    </MainContext.Provider>
  );
}
