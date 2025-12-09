'use client'

import { useContext, useState } from "react";
import SearchInput from "./SearchInput";
import Search from "./Search";
import { Artist } from "../types";
import { searchForArtist, searchSpotify } from "../lib/searchForTrack";
import MainContext from "../context";
import { formatArtistSearchResult } from "../lib/utilities";

export default function ArtistSearch() {
	const { accessToken } = useContext( MainContext );

	const [ selectedArtist, setSelectedArtist ] = useState<Artist>();

	async function search( searchTerm: string ) {
		const artists = await searchForArtist( accessToken, searchTerm );
		return artists.map( formatArtistSearchResult );
	}

	function select( artist: Artist ) {
		setSelectedArtist( artist );
	}

	return (
		<>
			<Search
				search={ search }
				select={ select }
				placeholder="Search for an artist"
			/>
			{ selectedArtist && selectedArtist.name }
		</>
	)
}