import { Playlist, Track, User } from "../types";
import { fetchAllItems, sendSpotifyApiRequest, stripSpotifyBase } from "./utilities";

export async function fetchPlaylistTracks(
	accessToken: string,
	playlist: Playlist
) {
	const url = stripSpotifyBase( playlist.tracks.href );

	const items = await fetchAllItems( accessToken, url );
	const tracks = items.map( t => t.track );

	return tracks;
}

export function findOverlap(
	tracklistA: Track[],
	tracklistB: Track[]
): Track[] {
	const tracklistAIds = tracklistA.map( t => t.id );
	const tracklistBIds = tracklistB.map( t => t.id );

	const overlap = [];
	tracklistAIds.forEach( ( trackId, i ) => {
		if ( tracklistBIds.includes( trackId ) ) {
			overlap.push( tracklistA[ i ] );
		}
	} );

	return overlap;
}


export async function createPlaylist(
	accessToken: string,
	user: User,
	trackList: Track[],
	name: string,
	description: string
): Promise<Playlist> {
	const newPlaylistDetails = {
		name,
		description,
		public: false
	}

	const newPlaylist = await sendSpotifyApiRequest(
		accessToken,
		'POST',
		`users/${ user.id }/playlists`,
		null,
		newPlaylistDetails
	);

	const trackUris = trackList.map( t => t.uri );

	await sendSpotifyApiRequest(
		accessToken,
		'POST',
		`playlists/${ newPlaylist.id }/tracks`,
		null,
		{ uris: trackUris }
	);

	return newPlaylist;
}
