'use client'

import { useEffect, useState } from "react";
import { SearchResult, SetState } from "../types";

interface Props {
	placeholder: string,
	callback: SetState<SearchResult>,
	delay?: number
}

export default function SearchInput( {
	placeholder,
	callback,
	delay = 1000
} ) {
	const [ searchValue, setSearchValue ] = useState<string>( '' );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( false );

	useEffect( () => {
		setReadyToSend( false );
		const timer = setTimeout( () => {
			setReadyToSend( true );
		}, delay );

		return () => clearTimeout( timer );
	}, [ searchValue ] );

	useEffect( () => {
		if ( readyToSend ) {
			callback( searchValue );
		}
	}, [ readyToSend ] )

	return (
		<input
			className="search-input"
			type='text'
			placeholder={ placeholder }
			value={ searchValue }
			onChange={ e => setSearchValue( e.target.value ) }
		/>
	)
}