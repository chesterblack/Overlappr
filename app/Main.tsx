"use client"

import MainContext from "./context";
import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import { User, Playlist } from "./types";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchAllItems } from "./lib/utilities";


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
		// Visually remove the auth code from the URL to prevent odd behaviour when
		// going forward/backward or refreshing
		if ( accessToken && code ) {
			window.history.replaceState( null, '', pathName );
		}

		// Get playlists for global use
		( async () => {
			if ( accessToken && ! playlists ) {
				const _playlists = await fetchAllItems( accessToken, 'me/playlists' );
				setPlaylists( _playlists );
			}
		} )();
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
