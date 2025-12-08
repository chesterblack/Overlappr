import { useState } from "react";
import SearchInput from "./SearchInput";
import SearchDropdown from "./SearchDropdown";
import { SearchResult } from "../types";
import SearchResultItem from "./SearchResultItem";

interface Props {
	search: ( searchValue: string ) => Promise<SearchResult[]>
	select: ( item: any ) => void
}

export default function Search( { search, select }: Props ) {
	const [ results, setResults ] = useState<SearchResult[]>( [] );
	const isOpen = results && results.length > 0;

	return (
		<div className={ `search ${ isOpen ? 'is-open' : '' }` }>
			<SearchInput
				placeholder='test'
				callback={ async ( searchValue: string ) => {
					console.log( 'searchValue: ', searchValue );
					const newResults = await search( searchValue );
					setResults( newResults );
				} }
			/>

			{ isOpen &&
				<SearchDropdown>
					{ results.map(
						result => <SearchResultItem
							key={ result.id }
							item={ result }
							onClick={ select }
						/>
					) }
				</SearchDropdown>
			}
		</div>
	)
}