"use client"

import { useContext, useState } from "react";
import PlaylistSelector from "./PlaylistSelector";
import { Component, Playlist } from "../types";
import MainContext from "../context";
import NewPlaylistMessage from "./NewPlaylistMessage";
import ErrorMessage from "./ErrorMessage";
import { createPlaylist, fetchPlaylistTracks, findOverlap } from "../lib/createPlaylists";


export default function PlaylistSelectors(): Component {
	const { accessToken, user } = useContext( MainContext );
	const [ playlistA, setPlaylistA ] = useState<Playlist>();
	const [ playlistB, setPlaylistB ] = useState<Playlist>();

	const [ newPlaylist, setNewPlaylist ] = useState<Playlist>();
	const [ errorMessage, setErrorMessage ] = useState<string>();

	const buttonEnabled = playlistA && playlistB;

	async function generatePlaylist() {
		if ( ! playlistA || ! playlistB ) {
			return;
		}

		const tracksA = await fetchPlaylistTracks( accessToken, playlistA );
		const tracksB = await fetchPlaylistTracks( accessToken, playlistB );

		const overlap = findOverlap( tracksA, tracksB );

		const name = `${ playlistA.name } ⚭ ${ playlistB.name }`;
		const description = `All songs that are in both '${ playlistA.name }' and '${ playlistB.name }'. Created with Overlappr.`;

		const newPlaylist = await createPlaylist(
			accessToken,
			user,
			overlap,
			name,
			description
		);

		setNewPlaylist( newPlaylist );
	}

	return (
		<>
			<div className="selectors">
				<PlaylistSelector selectedPlaylist={ playlistA } onChange={ setPlaylistA } />
				<span className="x">⚭</span>
				<PlaylistSelector selectedPlaylist={ playlistB } onChange={ setPlaylistB } />

				<button onClick={ generatePlaylist } disabled={ ! buttonEnabled }>
					Go!
				</button>
			</div>

			<ErrorMessage>{ errorMessage }</ErrorMessage>
			<NewPlaylistMessage playlist={ newPlaylist } />
		</>
	);
}
