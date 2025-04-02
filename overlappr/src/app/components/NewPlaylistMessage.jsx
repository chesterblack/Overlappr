export default function NewPlaylistMessage({ playlist }) {
	if ( ! playlist ) {
		return;
	}

	return (
		<div className="new-playlist">
			<a href={ playlist.external_urls.spotify }>{ playlist.name }</a> created.
		</div>
	);
}