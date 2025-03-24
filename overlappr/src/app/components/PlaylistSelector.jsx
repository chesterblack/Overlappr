"use client"

import { useContext, useEffect, useState } from "react";
import MainContext from "../context";
import { sendSpotifyApiRequest } from "../lib/utilities";
import PlaylistOption from "./PlaylistOption";


export default function PlaylistSelector( { onChange } ) {
	const { accessToken, playlists, setPlaylists } = useContext( MainContext );
	const [ options, setOptions ] = useState();
	const [ selectedPlaylist, setSelectedPlaylist ] = useState();

	useEffect( () => {
		( async () => {
			if ( accessToken && ! playlists ) {
				const _playlists = await fetchPlaylists( accessToken );
				setPlaylists( _playlists );
			}
		} )();
	}, [ accessToken ] );

	useEffect( () => {
		( async () => {
			if ( playlists ) {
				const newOptions = [
					<PlaylistOption />
				];

				for (let i = 0; i < playlists.length; i++) {
					const playlist = playlists[i];
					newOptions.push( <PlaylistOption playlist={ playlist } /> );
				}
		
				setOptions( newOptions );
			}
		} )()
	}, [ playlists ] );

	return (
		<select onChange={ ( event ) => {
			onChange( event );
			setSelectedPlaylist( event.target.value );
		} }>
			{ options }
		</select>
	);
}


/**
 * Recursively pings the /me/playlists endpoint until all playlists have been collated
 *
 * @param {string} accessToken Valid Spotify access token
 * @param {int} offset 
 * @param {int} limit 
 * @param {Array} playlists Array of playlist objects
 *
 * @returns {Array}
 */
async function fetchPlaylists(
	accessToken,
	offset = 0,
	limit = 50,
	playlists = []
) {
	const newPlaylists = await sendSpotifyApiRequest(
		`me/playlists?offset=${ offset }&limit=${ limit }`,
		accessToken
	).then( res => res.items );

	playlists = [ ...playlists, ...newPlaylists ];

	if ( newPlaylists.length === limit ) {
		playlists = await fetchPlaylists( accessToken, offset + limit, limit, playlists );
	}

	return playlists;
}