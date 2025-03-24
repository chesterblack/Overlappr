export default function PlaylistOption({ playlist }) {
	if ( ! playlist ) {
		return (
			<option disabled selected>
				<span>Select a playlist</span>
			</option>
		);
	}

	return (
		<option value={ playlist.id }>
			<img src={ playlist.images[0] } />
			<span>{ playlist.name }</span>
		</option>
	);
}