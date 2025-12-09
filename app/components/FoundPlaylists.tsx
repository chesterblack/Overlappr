import { Component, Playlist, Track } from "../types";
import FoundPlaylist from "./FoundPlaylist";

interface Props {
	found: Playlist[]
	selectedTrack: Track
	isLoading: boolean
	children: Component
}

export default function FoundPlaylists( { found, selectedTrack, isLoading, children }: Props ) {
	if ( ! selectedTrack || ! found ) {
		return;
	}

	if ( found !== null && found.length < 1 ) {
		if ( isLoading ) {
			return;
		}

		return (
			<div className="message">
				<strong>{ selectedTrack.name }</strong> not found in any of your playlists.
			</div>
		);
	}

	return (
		<div className="message">
			<span>Found <strong>{ selectedTrack && selectedTrack.name }</strong> in playlists:</span>
			<ul className="playlist-list">
				{ children }
			</ul>
		</div>
	);
}