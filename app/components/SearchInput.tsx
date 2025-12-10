'use client'

import { useEffect, useState } from "react";
import { SetState } from "../types";

interface Props {
	placeholder: string,
	callback: ( searchValue: string ) => any
	setIsLoading?: SetState<boolean>
	delay?: number
}

export default function SearchInput( {
	placeholder,
	callback,
	setIsLoading = () => {},
	delay = 1000
}: Props ) {
	const [ searchValue, setSearchValue ] = useState<string>( '' );
	const [ readyToSend, setReadyToSend ] = useState<boolean>( false );

	useEffect( () => {
		setIsLoading( true );
		setReadyToSend( false );

		const waitTime = searchValue === '' ? 1 : delay;
		const timer = setTimeout( () => {
			setReadyToSend( true );
		}, waitTime );

		return () => clearTimeout( timer );
	}, [ searchValue ] );

	useEffect( () => {
		( async () => {
			if ( readyToSend ) {
				await callback( searchValue );
				setIsLoading( false );
			}
		} )()
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