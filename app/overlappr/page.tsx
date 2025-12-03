import PlaylistSelectors from "../components/PlaylistSelectors";
import UserGreeting from "../components/User";
import "../css/overlappr.scss";

export const metadata = {
	title: 'Overlappr',
	description: 'Find the overlap between two Spotify playlists.',
};

export default function OverlapprHome() {
	return (
		<div className="overlappr">
			<main>
				<UserGreeting />
				<h1>Overlappr</h1>
				<PlaylistSelectors />
			</main>
		</div>
	);
}
