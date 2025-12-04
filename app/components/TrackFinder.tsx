'use client'

import { useContext, useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import Loading from "./Loading";
import { isTrackInPlaylist, searchForTrack } from "../lib/searchForTrack";
import MainContext from "../context";
import { Component, Playlist, Track } from "../types";
import TrackOption from "./TrackOption";
import GoButton from "./GoButton";
import FoundPlaylists from "./FoundPlaylists";

export default function TrackFinder() {
	const { accessToken, playlists } = useContext( MainContext );

	const [ isLoading, setIsLoading ] = useState<boolean>( false );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( true );
	const [ searchValue, setSearchValue ] = useState<string>( '' );
	const [ results, setResults ] = useState<Promise<Track[]>>();
	const [ tracks, setTracks ] = useState<Track[]>( [] );
	const [ selectedTrack, setSelectedTrack ] = useState<Track>();
	const [ found, setFound ] = useState<Playlist[]>( null );
	const [ message, setMessage ] = useState<Component>();

	useEffect( () => {
		setSelectedTrack( null );

		if ( ! searchValue ) {
			setIsLoading( false );
			setTracks( [] );
			return;
		}

		const timer = setTimeout(() => {
			setReadyToSend( true );
		}, 1000 );

		return () => clearTimeout( timer );
	}, [ searchValue ] );

	useEffect( () => {
		( async () => {
			setTracks( await results );
			setIsLoading( false );
		} )();
	}, [ results ] );

	useEffect( () => {
		if ( selectedTrack ) {
			setMessage( <>
				Search for <strong>{ selectedTrack ? selectedTrack.name : 'a song' }</strong> in your playlists
			</> );
			setFound( null );
		}
	}, [ selectedTrack ] )

	if ( readyToSend ) {
		if ( searchValue ) {
			setResults( searchForTrack( accessToken, searchValue ) );
			setMessage( null );
		} else {
			setTracks( [] );
		}

		setReadyToSend( false );
	}

	async function awaitAndCheck( i: number, soFar: Playlist[] = [] ) {
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

		awaitAndCheck( i + 1, soFar );
	}

	const isOpen = ! isLoading && tracks && tracks.length > 0 && ! selectedTrack;

	return (
		<>
			<div className={ `search ${ isOpen ? 'is-open' : '' }` }>
				<SearchInput
					searchValue={ searchValue }
					placeholder="Search for a track"
					setSearchValue={ setSearchValue }
					changeCallback={ e => {
						setIsLoading( true );
						setReadyToSend( false );
						setSearchValue( e.target.value );
					}
				} />

				{ searchValue &&
					<button className="search-clear" onClick={ () => {
						setMessage( null );
						setFound( null );
						setSelectedTrack( null );
						setSearchValue( '' );
					} }>
						╳
					</button>
				}

				<div className="search-results">
					{ isOpen && tracks.map( track => (
						<TrackOption
							track={ track }
							callback={ track => setSelectedTrack( track ) }
							key={ track.id }
						/>
					) ) }
				</div>
			</div>

			{ message &&
				<div className="message">
					{ message }
				</div>
			}

			<FoundPlaylists found={ found } selectedTrack={ selectedTrack } isLoading={ isLoading } />

			<GoButton
				callback={ () => awaitAndCheck( 0 ) }
				disabled={ ! selectedTrack || isLoading }
			/>

			{ isLoading && <Loading /> }
		</>
	);
}
