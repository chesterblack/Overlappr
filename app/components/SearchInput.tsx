import { ChangeEventHandler } from "react";
import { SetState } from "../types";

interface Props {
	searchValue: string
	placeholder: string
	setSearchValue: SetState<string>
	changeCallback?: ChangeEventHandler<HTMLInputElement>
}

export default function SearchInput( {
	searchValue,
	placeholder,
	setSearchValue,
	changeCallback = ( _e ) => {}
}: Props ) {
	return (
		<input
			className="search-input"
			type='text'
			placeholder={ placeholder }
			value={ searchValue }
			onChange={ e => {
				setSearchValue( e.target.value );
				changeCallback( e );
			} }
		/>
	)
}