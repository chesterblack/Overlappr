import FoundPlaylist from "./FoundPlaylist";

export default function FoundPlaylists( { found, selectedTrack, isLoading } ) {
	if ( ! selectedTrack || ! found || ( found && found.length < 1 && ! isLoading ) ) {
		return;
	}

	if ( found && found.length < 1 && ! isLoading ) {
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
				{ found.map( playlist => (
					<FoundPlaylist key={ playlist.id } playlist={ playlist } />
				) ) }
			</ul>
		</div>
	);
}