import { useContext, useEffect } from "react";
import PlaylistSelectors from "./PlaylistSelectors";
import User from "./User"
import MainContext from "../context";
import { recursivelyFetchItems } from "../lib/utilities";

export default function MainPage({}) {
	const { playlists, setPlaylists, accessToken } = useContext( MainContext );

	// Get playlists for global use
	useEffect( () => {
		( async () => {
			if ( accessToken && ! playlists ) {
				const _playlists = await recursivelyFetchItems( accessToken, 'me/playlists' );
				setPlaylists( _playlists );
			}
		} )();
	}, [ accessToken ] );

	return (
		<>
			<User />
			<h1>Overlappr</h1>
			<PlaylistSelectors />
		</>
	);
}