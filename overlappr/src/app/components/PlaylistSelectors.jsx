"use client"

import { useContext, useState } from "react";
import PlaylistSelector from "./PlaylistSelector";
import { sendSpotifyApiRequest } from "../lib/utilities";
import MainContext from "../context";

export default function PlaylistSelectors({}) {
	const { accessToken } = useContext( MainContext );
	const [ playlistIdA, setPlaylistIdA ] = useState();
	const [ playlistIdB, setPlaylistIdB ] = useState();


	async function fetchPlaylistItems( playlistId ) {
		const playlistItems = await sendSpotifyApiRequest( `playlists/${ playlistId }/tracks`, accessToken );

		let items = playlistItems.items;

		if ( playlistItems.next ) {
			let nextPath = playlistItems.next.replace( 'https://api.spotify.com/v1/', '' );
			while ( nextPath ) {
				const newPlaylistItems = await sendSpotifyApiRequest( nextPath, accessToken );
				items = [ ...items, ...newPlaylistItems.items ];
				if ( newPlaylistItems.next ) {
					nextPath = newPlaylistItems.next.replace( 'https://api.spotify.com/v1/', '' );
				} else {
					nextPath = false;
				}
			}
		}

		return items;
	}


	async function findOverlap() {
		const playlistAItems = await fetchPlaylistItems( playlistIdA );
		const playlistBItems = await fetchPlaylistItems( playlistIdB );

		const playlistATrackIds = playlistAItems.map( ( i ) => i.track.id );
		const playlistBTrackIds = playlistBItems.map( ( i ) => i.track.id );

		const overlap = playlistATrackIds.filter( ( t ) => playlistBTrackIds.includes( t ) );

		return overlap;
	}

	const buttonEnabled = playlistIdA && playlistIdB;

	return (
		<div>
			<PlaylistSelector onChange={ ( event ) => {
				const newValue = event.target.value;
				setPlaylistIdA( newValue );
			} } />
			<PlaylistSelector onChange={ ( event ) => {
				const newValue = event.target.value;
				setPlaylistIdB( newValue );
			} } />

			<button onClick={ findOverlap } disabled={ ! buttonEnabled }>
				Go!
			</button>
		</div>
	);
}
