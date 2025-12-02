'use client'

import { ChangeEvent, useState } from "react";

interface Props {
	changeCallback?: ( e: ChangeEvent<HTMLInputElement> ) => any
}

export default function TrackSearch( {
	changeCallback = ( _e ) => {}
}: Props ) {
	const [ searchValue, setSearchValue ] = useState<string>( '' );

	function onChange( e: ChangeEvent<HTMLInputElement> ) {
		setSearchValue( e.target.value );
		changeCallback( e );
	}

	return (
		<input
			type='text'
			placeholder='Search for a track'
			value={ searchValue }
			onChange={ onChange }
		/>
	)
}