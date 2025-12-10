import UserGreeting from '../components/User';
import FindrSearch from './FindrSearch';
import '../css/findr.scss';

export const metadata = {
	title: 'Findr',
	description: 'Find which of your playlists a song is in.',
};

export default function Findr() {
	return (
		<div className="findr">
			<div className="line-1"></div>
			<div className="line-2"></div>
			<main>
				<UserGreeting />
				<h1>Findr</h1>
				<FindrSearch />
			</main>
		</div>
	)
}