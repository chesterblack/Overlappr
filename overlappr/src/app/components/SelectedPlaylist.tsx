import Image from "next/image";
import { Component, Playlist } from "../types";

interface Props {
	playlist: Playlist
}

export default function SelectedPlaylist( { playlist }: Props ): Component {
	return (
		<>
			<Image src={ playlist.images[0].url } width={ 30 } height={ 30 } alt={ playlist.name } />
			<span>{ playlist.name }</span>
		</>
	)
}