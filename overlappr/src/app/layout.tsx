import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter( { subsets: [ "latin" ] } );

export const metadata = {
	title: 'Overlappr',
	description: 'Find the overlap between two Spotify playlists.',
};

export default function RootLayout( { children } ) {
	return (
		<html lang="en">
			<body className={ `${ inter.className } overlappr` }>
				{ children }
			</body>
		</html>
	);
}
