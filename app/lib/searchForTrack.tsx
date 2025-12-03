import { Track } from "../types";
import { sendSpotifyApiRequest } from "./utilities";

export async function searchForTrack(
	accessToken: string,
	searchTerm: string
): Promise<Track[]> {
	const queryParams = {
		q: searchTerm,
		type: 'track'
	};

	const results = await sendSpotifyApiRequest( accessToken, 'GET', 'search', queryParams );

	return results.tracks.items;
}