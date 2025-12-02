"use client"

import MainContext from "./context";
import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import ToolList from "./components/ToolList";
import { User, Playlist, Component } from "./types";
import { usePathname, useSearchParams } from "next/navigation";


export default function Main( { children } ) {
	const [ accessToken, setAccessToken ] = useState<string>();
	const [ refreshToken, setRefreshToken ] = useState<string>();
	const [ tokenExpires, setTokenExpires ] = useState<string>();
	const [ user, setUser ] = useState<User>();
	const [ playlists, setPlaylists ] = useState<Playlist[]>();

	const pathName = usePathname();
	const searchParams = useSearchParams()
	const code = searchParams.get('code');

	useEffect( () => {
		if ( accessToken && code ) {
			window.history.replaceState( null, '', pathName );
		}
	}, [ accessToken ] );

	return (
		<MainContext.Provider value={{
			accessToken, setAccessToken,
			refreshToken, setRefreshToken,
			tokenExpires, setTokenExpires,
			user, setUser,
			playlists, setPlaylists
		}}>
			{ accessToken ? children : <Auth redirect_path={ pathName } /> }
		</MainContext.Provider>
	);
}
