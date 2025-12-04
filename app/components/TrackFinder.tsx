'use client'

import { useContext, useEffect, useState } from "react";
import TrackSearchInput from "./TrackSearchInput";
import Loading from "./Loading";
import { searchForTrack } from "../lib/searchForTrack";
import MainContext from "../context";
import { Track } from "../types";
import TrackOption from "./TrackOption";
import GoButton from "./GoButton";

export default function TrackFinder() {
	const { accessToken } = useContext( MainContext );

	const [ isLoading, setIsLoading ] = useState<boolean>( false );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( true );
	const [ searchValue, setSearchValue ] = useState<string>( '' );
	const [ results, setResults ] = useState<Promise<Track[]>>();
	const [ tracks, setTracks ] = useState<Track[]>( [] );
	const [ selectedTrack, setSelectedTrack ] = useState<Track>();

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

	if ( readyToSend ) {
		if ( searchValue ) {
			setResults( searchForTrack( accessToken, searchValue ) );
		} else {
			setTracks( [] );
		}

		setReadyToSend( false );
	}

	const isOpen = tracks && tracks.length > 0 && ! selectedTrack;

	return (
		<>
			<div className={ `track-search ${ isOpen ? 'is-open' : '' }` }>
				<TrackSearchInput
					searchValue={ searchValue }
					setSearchValue={ setSearchValue }
					changeCallback={ e => {
						setIsLoading( true );
						setReadyToSend( false );
						setSearchValue( e.target.value );
					}
				} />

				{
					searchValue &&
					<button className="track-search-clear" onClick={ () => {
						setSearchValue( '' );
					} }>
						╳
					</button>
				}

				<div className="track-search-results">
					{ isOpen && tracks.map( track => (
						<TrackOption
							track={ track }
							callback={ track => setSelectedTrack( track ) }
							key={ track.id }
						/>
					) ) }
				</div>
			</div>

			<div className="new-playlist">
				<div>Search for <strong>{ selectedTrack ? selectedTrack.name : 'a song' }</strong> in your playlists</div>
			</div>

			<GoButton
				callback={() => console.log(selectedTrack)}
				disabled={ ! selectedTrack }
			/>

			{ isLoading && <Loading /> }
		</>
	);
}