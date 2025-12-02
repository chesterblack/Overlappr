'use client'

import { useEffect, useState } from "react";
import TrackSearch from "./TrackSearch";

export default function TrackFinder() {
	const [ isLoading, setIsLoading ] = useState<boolean>( false );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( true );
	const [ searchValue, setSearchValue ] = useState<string>();

	useEffect( () => {
		const timer = setTimeout(() => {
			setIsLoading( false );
			setReadyToSend( true );
		}, 1000 );

		return () => clearTimeout( timer );
	}, [ searchValue ] );

	if ( ! isLoading && searchValue && readyToSend ) {
		console.log( searchValue );
		setReadyToSend( false );
	}

	return (
		<>
			{ isLoading && 'Loading...' }
			<TrackSearch changeCallback={ e => {
				setIsLoading( true );
				setReadyToSend( false );
				setSearchValue( e.target.value );
			} } />
		</>
	);
}