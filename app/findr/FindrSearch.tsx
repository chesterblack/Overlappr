'use client'

import { useContext, useState } from "react";
import MainContext from "../context";
import Search from "../components/Search";
import { isTrackInPlaylist, searchForTrack } from "../lib/searchForTrack";
import { Component, Playlist, SearchResult, Track } from "../types";
import GoButton from "../components/GoButton";
import Loading from "../components/Loading";
import FoundPlaylists from "../components/FoundPlaylists";

export default function FindrSearch() {
	const { accessToken, playlists } = useContext( MainContext );

	const [ selectedTrack, setSelectedTrack ] = useState<Track>();
	const [ message, setMessage ] = useState<Component>();
	const [ forceShut, setForceShut ] = useState<boolean>( false );
	const [ isLoading, setIsLoading ] = useState<boolean>( false );
	const [ found, setFound ] = useState<Playlist[]>( null );

	async function search( searchValue: string ): Promise<SearchResult[]> {
		if ( ! searchValue || searchValue === '' ) {
			setSelectedTrack( null );
			setMessage( <></> );
			return [];
		}

		setForceShut( false );

		const tracks = await searchForTrack( accessToken, searchValue );

		return tracks.map( track => ( {
			id: track.id,
			title: track.name,
			fullItem: track,
			subtitle: track.artists[0].name,
			image: {
				url: track.album.images[0].url,
				alt: track.album.name,
				width: 30,
				height: 30
			}
		} ) );
	}

	function select( track: Track ) {
		setFound( null );
		setSelectedTrack( track );
		setMessage( <>Search for <strong>{ track.name }</strong> in your playlists.</> );
		setForceShut( true );
	}

	async function checkPlaylist( i: number, soFar: Playlist[] = [] ) {
		if ( ! selectedTrack ) {
			return;
		}

		setIsLoading( true );

		const playlist = playlists[ i ];
		setMessage( <>Checking <strong>{ playlist.name }</strong>...</> );
		setFound( soFar );
		
		const isInPlaylist = await isTrackInPlaylist(
			accessToken,
			selectedTrack,
			playlist
		);
		
		if ( isInPlaylist ) {
			soFar.push( playlist );
		}

		if ( i === playlists.length - 1 ) {
			setMessage( null );
			setIsLoading( false );
			return;
		}

		checkPlaylist( i + 1, soFar );
	}

	return (
		<>
			<Search
				placeholder='Search for a track'
				search={ search }
				select={ select }
				forceShut={ forceShut }
			/>

			{ isLoading && <Loading /> }
			{ message && <div className="message"> { message } </div> }

			<FoundPlaylists found={ found } selectedTrack={ selectedTrack } isLoading={ isLoading } />

			<GoButton
				callback={ () => checkPlaylist( 0 ) }
				disabled={ ! selectedTrack || isLoading }
			/>
		</>
	)
}