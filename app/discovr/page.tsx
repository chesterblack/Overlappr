import ArtistSearch from "../components/ArtistSearch";
import GoButton from "../components/GoButton";
import UserGreeting from "../components/User";
import "../css/discovr.scss";

export const metadata = {
	title: 'Discovr',
	description: 'Create a playlist from an artist\'s related artists\' top songs.',
};

export default function Discovr() {
		return (
		<div className="discovr">
			<div className="line-1"></div>
			<div className="line-2"></div>
			<div className="line-3"></div>
			<div className="line-4"></div>
			<main>
				<UserGreeting />
				<h1>Discovr</h1>
				<ArtistSearch />
			</main>
		</div>
	)
}