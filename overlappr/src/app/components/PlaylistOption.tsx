import { Playlist, SetState } from "../types";

interface Props {
	playlist: Playlist
	setSelectedPlaylist: SetState<Playlist>
	onChange: ( id: string ) => void
}

export default function PlaylistOption( {
	playlist,
	setSelectedPlaylist,
	onChange
}: Props ) {

	function onClick() {
		setSelectedPlaylist( playlist );
		onChange( playlist.id );

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
