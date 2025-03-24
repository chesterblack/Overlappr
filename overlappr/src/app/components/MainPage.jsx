import PlaylistSelectors from "./PlaylistSelectors";
import User from "./User"

export default function MainPage({}) {
	return (
		<>
			<User />
			<h1>Overlappr</h1>
			<PlaylistSelectors />
		</>
	);
}