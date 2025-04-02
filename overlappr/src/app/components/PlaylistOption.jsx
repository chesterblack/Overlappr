export default function PlaylistOption( {
	playlist,
	setSelectedPlaylist,
	onChange
} ) {
	return (
		<div className='option' onClick={ () => {
			setSelectedPlaylist( playlist );
			onChange( playlist.id );
			document.activeElement.blur();
		} }>
			{ playlist.name }
		</div>
	);
}
