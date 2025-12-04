'use client'

import { useState } from "react";
import SearchInput from "./SearchInput";

export default function ArtistSearch() {
	const [ searchValue, setSearchValue ] = useState<string>( '' );

	return (
		<div className="search">
			<SearchInput
				searchValue={ searchValue }
				placeholder="Search for a track"
				setSearchValue={ setSearchValue }
				changeCallback={ e => {
					console.log( e.target.value );
				}
			} />
		</div>
	)
}