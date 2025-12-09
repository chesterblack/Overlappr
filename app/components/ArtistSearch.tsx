'use client'

import { useContext, useState } from "react";
import SearchInput from "./SearchInput";
import Search from "./Search";
import { Artist } from "../types";
import { searchForArtist, searchSpotify } from "../lib/searchForTrack";
import MainContext from "../context";
import { formatArtistSearchResult, sendSpotifyApiRequest } from "../lib/utilities";
import GoButton from "./GoButton";

export default function ArtistSearch() {
	const { accessToken } = useContext( MainContext );

	const [ selectedArtist, setSelectedArtist ] = useState<Artist>();
	const [ forceShut, setForceShut ] = useState<boolean>( false );

	async function search( searchTerm: string ) {
		setForceShut( false );
		const artists = await searchForArtist( accessToken, searchTerm );
		return artists.map( formatArtistSearchResult );
	}

	function select( artist: Artist ) {
		setForceShut( true );
		setSelectedArtist( artist );
	}

	async function getRelatedArtists( artist: Artist ) {
		const { genres } = artist;

		const queryParams = {
			q: `${ genres[0] } genre`,
			type: 'artist',
			limit: 50
		};

		const results = await sendSpotifyApiRequest(
			accessToken,
			'GET',
			'search',
			queryParams
		);

		console.log( 'results: ', results );

		const artistNames = results.artists.items.map( artist => artist.name );

		console.log( 'artistNames: ', artistNames );
	}

	return (
		<>
			<Search
				search={ search }
				select={ select }
				placeholder="Search for an artist"
				forceShut={ forceShut }
			/>

			{ selectedArtist && selectedArtist.name }

			<GoButton
				callback={ () => { getRelatedArtists( selectedArtist ) } }
				disabled={ ! selectedArtist }
			/>
		</>
	)
}