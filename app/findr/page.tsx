import TrackFinder from '../components/TrackFinder';
import UserGreeting from '../components/User';
import '../css/findr.scss';

export const metadata = {
	title: 'Findr',
	description: 'Find which of your playlists a song is in.',
};

export default function FindrHomepage() {
	// ᪠

	return (
		<div className="findr">
			<div className="line-1"></div>
			<div className="line-2"></div>
			<main>
				<UserGreeting />
				<h1>Findr</h1>
				<TrackFinder />
			</main>
		</div>
	)
}