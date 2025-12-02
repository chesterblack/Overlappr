import Image from "next/image";
import { Track } from "../types";

interface Props {
	track: Track
	callback?: ( track: Track ) => any
}

export default function TrackOption( { track, callback = () => {} }: Props ) {
	return (
		<div className="track-option" onClick={ () => callback( track ) }>
			<Image
				className="track-image"
				src={ track.album.images[0].url }
				width={ 30 }
				height={ 30 }
				alt={ track.album.name }
			/>
			<div>
				<span className="track-name">{ track.name }</span>
				<span className="track-artist">{ track.artists[0].name }</span>
			</div>
		</div>
	);
}