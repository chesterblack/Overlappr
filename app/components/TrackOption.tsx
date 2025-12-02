import Image from "next/image";
import { Track } from "../types";

interface Props {
	track: Track
}

export default function TrackOption( { track }: Props ) {
	return (
		<div>
			<Image
				className="track-image"
				src={ track.album.images[0].url }
				width={ 30 }
				height={ 30 }
				alt={ track.album.name }
			/>
			<span className="track-name">{ track.name }</span>
			<span className="track-artist">{ track.artists[0].name }</span>
		</div>
	);
}