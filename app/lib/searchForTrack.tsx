import { Playlist, Track } from "../types";
import { areTracksSame, fetchAllItems, sendSpotifyApiRequest, stripSpotifyBase } from "./utilities";

export async function searchForTrack(
	accessToken: string,
	searchTerm: string
): Promise<Track[]> {
	if ( ! searchTerm || searchTerm === '' ) {
		return [];
	}

	const queryParams = {
		q: searchTerm,
		type: 'track'
	};

	const results = await sendSpotifyApiRequest( accessToken, 'GET', 'search', queryParams );

	return results.tracks.items;
}

export async function findTrackInPlaylists(
	accessToken: string,
	track: Track,
	playlists: Playlist[]
): Promise<Playlist[]> {
	const checkedPlaylists = await Promise.all(
		playlists.map( async playlist => {
			const isInPlaylist = await isTrackInPlaylist( accessToken, track, playlist );
			return isInPlaylist ? playlist : null;
		} )
	);

	const foundPlaylists = checkedPlaylists.filter( playlist => playlist );

	return foundPlaylists;
}

export async function isTrackInPlaylist(
	accessToken: string,
	track: Track,
	playlist: Playlist
): Promise<boolean> {
	const trackList = await fetchAllItems(
		accessToken,
		stripSpotifyBase( playlist.tracks.href )
	) as { track: Track }[];

	const inList = trackList.filter( t => areTracksSame( t.track, track ) );
	const found = inList.length > 0;

	return found;
}
