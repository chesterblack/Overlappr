"use client"

import MainContext from "./context";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import MainPage from "./components/MainPage";
import { Component, Playlist, User } from "./types";

export default function Home() {
	const [ accessToken, setAccessToken ] = useState<string>();
	const [ refreshToken, setRefreshToken ] = useState<string>();
	const [ tokenExpires, setTokenExpires ] = useState<string>();
	const [ user, setUser ] = useState<User>();
	const [ playlists, setPlaylists ] = useState<Playlist[]>();

	const [ inner, setInner ] = useState<Component>( '' );

	useEffect( () => {
		if ( accessToken ) {
			window.history.replaceState( null, '', '/' );
			setInner( <MainPage /> );
		} else {
			setInner( <Auth /> );
		}
	}, [ accessToken ] );

	return (
		<MainContext.Provider value={{
				accessToken, setAccessToken,
				refreshToken, setRefreshToken,
				tokenExpires, setTokenExpires,
				user, setUser,
				playlists, setPlaylists
			}}
		>
			<main>
				{ inner }
			</main>
		</MainContext.Provider>
	);
}
