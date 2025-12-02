'use client'

import { ChangeEvent, useState } from "react";
import { SetState } from "../types";

interface Props {
	searchValue: string
	setSearchValue: SetState<string>
	changeCallback?: ( e: ChangeEvent<HTMLInputElement> ) => any
}

export default function TrackSearchInput( {
	searchValue,
	setSearchValue,
	changeCallback = ( _e ) => {}
}: Props ) {
	return (
		<input
			className="track-search-input"
			type='text'
			placeholder='Search for a track'
			value={ searchValue }
			onChange={ e => {
				setSearchValue( e.target.value );
				changeCallback( e );
			} }
		/>
	)
}