import { Component, Playlist } from "../types";

interface Props {
	playlist: Playlist
}

export default function NewPlaylistMessage( { playlist }: Props ): Component {
	if ( ! playlist ) {
		return;
	}

	return (
		<div className="new-playlist">
			<a href={ playlist.external_urls.spotify }>{ playlist.name }</a> created.
		</div>
	);
}