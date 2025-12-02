import { Playlist, SetState } from "../types";

interface Props {
	playlist: Playlist
	onChange: ( playlist: Playlist ) => void
}

export default function PlaylistOption( {
	playlist,
	onChange
}: Props ) {

	function onClick() {
		onChange( playlist );

		try {
			( document.activeElement as HTMLElement ).blur();
		} catch( error ) {
			console.error( error );
		}
	}

	return (
		<div className='option' onClick={ onClick }>
			{ playlist.name }
		</div>
	);
}
