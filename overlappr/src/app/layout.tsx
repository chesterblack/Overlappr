import { Poppins } from "next/font/google";
import "./globals.scss";

const poppins = Poppins( { weight: ['300', '500', '800', '900'] } );

export const metadata = {
	title: 'Overlappr',
	description: 'Find the overlap between two Spotify playlists.',
};

export default function RootLayout( { children } ) {
	return (
		<html lang="en">
			<body className={ `${ poppins.className } overlappr` }>
				{ children }
			</body>
		</html>
	);
}
