"use client"

import { useContext, useEffect, useState } from "react";
import PlaylistSelector from "./PlaylistSelector";
import { recursivelyFetchItems, sendSpotifyApiRequest } from "../lib/utilities";
import MainContext from "../context";
import NewPlaylistMessage from "./NewPlaylistMessage";
import ErrorMessage from "./ErrorMessage";


export default function PlaylistSelectors({}) {
	const { accessToken, user, playlists, setPlaylists } = useContext( MainContext );
	const [ playlistIdA, setPlaylistIdA ] = useState();
	const [ playlistIdB, setPlaylistIdB ] = useState();
	const [ newPlaylist, setNewPlaylist ] = useState();
	const [ errorMessage, setErrorMessage ] = useState();

	useEffect(() => {
		( async () => {
			const response = await fetch( 'https://api.spotify.com/v1/playlists/2TmyYbudsINZNscclPYuRW/tracks?offset=400&limit=100&locale=en-GB,en-US;q%3D0.9,en;q%3D0.8', {
				cache: 'no-store',
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + accessToken
				}
			} );

			console.log( 'response: ', response );
		} )()
	}, []);


	async function fetchPlaylistItems( playlistId ) {
		const items = await recursivelyFetchItems(
			accessToken,
			`playlists/${ playlistId }/tracks`
		);

		return items;
	}

	async function findOverlap() {
		const playlistAItems = await fetchPlaylistItems( playlistIdA );
		const playlistBItems = await fetchPlaylistItems( playlistIdB );

		const playlistATrackUris = playlistAItems.map( ( i ) => i?.track?.uri );
		const playlistBTrackUris = playlistBItems.map( ( i ) => i?.track?.uri );

		const overlap = playlistATrackUris.filter( (t) => {
			if ( playlistBTrackUris.includes( t ) ) {
				console.log( 't: ', t );
			}
			return playlistBTrackUris.includes( t );
		} );

		console.log( 'overlap: ', overlap );

		return overlap;
	}

	async function createOverlappedPlaylist() {
		setErrorMessage();
		setNewPlaylist();
		const overlap = await findOverlap();

		if ( overlap.length < 1 ) {
			setErrorMessage( 'No overlap' );
			return;
		}

		return;

		const endpoint = `users/${ user.id }/playlists`;

		const playlistA = playlists.find( i => i.id === playlistIdA );
		const playlistB = playlists.find( i => i.id === playlistIdB );

		const name = `${ playlistA.name } ⚭ ${ playlistB.name }`;
		const description = `All songs that are in both '${ playlistA.name }' and '${ playlistB.name }'. Created with Overlappr.`;

		const newPlaylistDetails = {
			name,
			description,
			public: false
		}
	
		const newPlaylist = await sendSpotifyApiRequest(
			accessToken,
			'POST',
			endpoint,
			null,
			newPlaylistDetails
		);

		await sendSpotifyApiRequest(
			accessToken,
			'POST',
			`playlists/${ newPlaylist.id }/tracks`,
			null,
			{ uris: overlap }
		);

		setNewPlaylist( newPlaylist );
	}


	const buttonEnabled = playlistIdA && playlistIdB;

	return (
		<>
			<div className="selectors">
				<PlaylistSelector onChange={ setPlaylistIdA } />
				<span className="x">⚭</span>
				<PlaylistSelector onChange={ setPlaylistIdB } />

				<button onClick={ createOverlappedPlaylist } disabled={ ! buttonEnabled }>
					Go!
				</button>
			</div>

			<ErrorMessage>{ errorMessage }</ErrorMessage>
			<NewPlaylistMessage playlist={ newPlaylist } />
		</>
	);
}
