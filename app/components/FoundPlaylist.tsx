import Link from "next/link";
import { Playlist } from "../types";

interface Props {
	playlist: Playlist
}

export default function FoundPlaylist( { playlist }: Props ) {
	return (
		<Link href={ playlist.external_urls.spotify } target="_blank">
			<li>
				{ playlist.name }
			</li>
		</Link>
	)
}