"use client"

import { useContext, useState } from "react";
import MainContext from "../context";
import PlaylistOption from "./PlaylistOption";


export default function PlaylistSelector( { onChange } ) {
	const { playlists } = useContext( MainContext );
	const [ selectedPlaylist, setSelectedPlaylist ] = useState();

	const playlistOptions = playlists?.map( ( playlist ) => (
		<PlaylistOption
			playlist={ playlist }
			key={ playlist.id }
			setSelectedPlaylist={ setSelectedPlaylist }
			onChange={ onChange }
		/>
	) );

	return (
		<div tabIndex='0' className='select'>
			<div>
				{ selectedPlaylist?.name || 'Select a playlist' }
			</div>
			<div className="options">
				{ playlistOptions }
			</div>
		</div>
	);
}
