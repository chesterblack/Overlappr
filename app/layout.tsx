import "./css/globals.scss";
import Main from "./Main";
import { Poppins } from "next/font/google";

export const metadata = {
	title: 'Overlappr',
	description: 'Find the overlap between two Spotify playlists.',
};

const poppins = Poppins( { weight: ['300', '500', '800', '900'] } );

export default function RootLayout( { children } ) {
	return(
		<html lang="en">
			<body className={ `${ poppins.className }` }>
				<Main>
					{ children }
				</Main>
			</body>
		</html>
	);
}
