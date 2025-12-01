import { useContext, useEffect } from "react";
import PlaylistSelectors from "./PlaylistSelectors";
import UserGreeting from "./User"
import MainContext from "../context";
import { fetchAllItems } from "../lib/utilities";
import { Component } from "../types";

export default function MainPage(): Component {
	const { playlists, setPlaylists, accessToken } = useContext( MainContext );

	// Get playlists for global use
	useEffect( () => {
		( async () => {
			if ( accessToken && ! playlists ) {
				const _playlists = await fetchAllItems( accessToken, 'me/playlists' );
				setPlaylists( _playlists );
			}
		} )();
	}, [ accessToken ] );

	return (
		<>
			<UserGreeting />
			<h1>Overlappr</h1>
			<PlaylistSelectors />
		</>
	);
}