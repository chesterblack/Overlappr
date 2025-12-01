"use client"

import { useContext, useState } from "react";
import MainContext from "../context";
import PlaylistOption from "./PlaylistOption";
import { Playlist } from "../types";

interface Props {
	onChange: ( id: string ) => void
}

export default function PlaylistSelector( { onChange }: Props ) {
	const { playlists } = useContext( MainContext );
	const [ selectedPlaylist, setSelectedPlaylist ] = useState<Playlist>();

	const playlistOptions = playlists?.map( ( playlist: Playlist ) => (
		<PlaylistOption
			playlist={ playlist }
			key={ playlist.id }
			setSelectedPlaylist={ setSelectedPlaylist }
			onChange={ onChange }
		/>
	) );

	return (
		<div tabIndex={ 0 } className='select'>
			<div>
				{ selectedPlaylist?.name || 'Select a playlist' }
			</div>
			<div className="options">
				{ playlistOptions }
			</div>
		</div>
	);
}
