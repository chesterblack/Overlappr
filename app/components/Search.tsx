import { ChangeEventHandler, useState } from "react";
import SearchInput from "./SearchInput";
import SearchDropdown from "./SearchDropdown";
import { SearchResult } from "../types";
import SearchResultItem from "./SearchResultItem";
import Loading from "./Loading";

interface Props {
	search: ( searchValue: string ) => Promise<SearchResult[]>
	select: ( item: any ) => void
	placeholder?: string
	forceShut?: boolean
}

export default function Search( { search, select, placeholder = '', forceShut = false }: Props ) {
	const [ results, setResults ] = useState<SearchResult[]>( [] );
	const [ isLoading, setIsLoading ] = useState<boolean>( false );

	const isOpen = ( results && results.length > 0 && ! forceShut ) || isLoading;

	return (
		<div className={ `search ${ isOpen ? 'is-open' : '' }` }>
			<SearchInput
				placeholder={ placeholder }
				setIsLoading={ setIsLoading }
				callback={ async ( searchValue: string ) => {
					const newResults = await search( searchValue );
					setResults( newResults );
				} }
			/>

			{ isOpen &&
				<SearchDropdown>
					{ isLoading ?
						<Loading /> :
						results.map(
							result => <SearchResultItem
								key={ result.id }
								item={ result }
								onClick={ e => {
									select( e );
								} }
							/>
						) }
				</SearchDropdown>
			}
		</div>
	)
}