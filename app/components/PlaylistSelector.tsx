"use client"

import { useContext } from "react";
import MainContext from "../context";
import PlaylistOption from "./PlaylistOption";
import { Playlist } from "../types";
import Loading from "./Loading";
import SelectedPlaylist from "./SelectedPlaylist";

interface Props {
	selectedPlaylist: Playlist
	onChange: ( playlist: Playlist ) => void
}

export default function PlaylistSelector( { selectedPlaylist, onChange }: Props ) {
	const { playlists } = useContext( MainContext );

	const playlistOptions = playlists?.map( ( playlist: Playlist ) => (
		<PlaylistOption
			playlist={ playlist }
			key={ playlist.id }
			onChange={ onChange }
		/>
	) );

	return (
		<div tabIndex={ 0 } className='select'>
			<div className={ `select-inner ${ selectedPlaylist ? 'has-image' : '' }` }>
				{ selectedPlaylist ? <SelectedPlaylist playlist={ selectedPlaylist } /> : 'Select a playlist' }
			</div>
			<div className="options">
				{ playlistOptions }
			</div>
		</div>
	);
}
