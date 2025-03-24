"use client"

import MainContext from "./context";
import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import MainPage from "./components/MainPage";

export default function Home() {
	const [ accessToken, setAccessToken ] = useState();
	const [ refreshToken, setRefreshToken ] = useState();
	const [ tokenExpires, setTokenExpires ] = useState();
	const [ user, setUser ] = useState();
	const [ playlists, setPlaylists ] = useState();

	const [ inner, setInner ] = useState('');

	useEffect( () => {
		if ( accessToken ) {
			window.history.replaceState(null, '', '/');
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
