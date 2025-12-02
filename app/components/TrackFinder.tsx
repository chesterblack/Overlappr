'use client'

import { useContext, useEffect, useState } from "react";
import TrackSearchInput from "./TrackSearchInput";
import Loading from "./Loading";
import { searchForTrack } from "../lib/searchForTrack";
import MainContext from "../context";
import { Track } from "../types";
import TrackOption from "./TrackOption";

export default function TrackFinder() {
	const { accessToken } = useContext( MainContext );

	const [ isLoading, setIsLoading ] = useState<boolean>( false );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( true );
	const [ searchValue, setSearchValue ] = useState<string>();
	const [ results, setResults ] = useState<Promise<Track[]>>();
	const [ tracks, setTracks ] = useState<Track[]>( [] );

	useEffect( () => {
		const timer = setTimeout(() => {
			setIsLoading( false );
			setReadyToSend( true );
		}, 1000 );

		return () => clearTimeout( timer );
	}, [ searchValue ] );

	useEffect( () => {
		( async () => {
			setTracks( await results );
		} )();
	}, [ results ] );

	if ( ! isLoading && readyToSend ) {
		if ( searchValue ) {
			setResults( searchForTrack( accessToken, searchValue ) );
		} else {
			setTracks( [] );
		}

		setReadyToSend( false );
	}

	return (
		<>
		<div className="track-search">
			<TrackSearchInput changeCallback={ e => {
				setIsLoading( true );
				setReadyToSend( false );
				setSearchValue( e.target.value );
			} } />
			<div className="track-search-results">
				{ tracks && tracks.map( track => (
					<TrackOption track={ track } key={ track.id } />
				) ) }
			</div>
		</div>
			{ isLoading && <Loading /> }
		</>
	);
}