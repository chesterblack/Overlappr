import { Suspense } from "react";
import "./css/globals.scss";
import Main from "./Main";
import { Poppins } from "next/font/google";
import Loading from "./components/Loading";

export const metadata = {
	title: 'Spotify Tools',
	description: 'A suite of tools to manipulate your Spotify playlists.',
};

const poppins = Poppins( { weight: ['200', '300', '500', '800', '900'] } );

export default function RootLayout( { children } ) {
	return(
		<html lang="en">
			<body className={ `${ poppins.className }` }>
				<Suspense fallback={ <Loading /> }>
					<Main>
						{ children }
					</Main>
				</Suspense>
			</body>
		</html>
	);
}
