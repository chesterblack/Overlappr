'use client'

import Search from "../components/Search";

export default function TestPage() {
	return <main>
		<Search
			search={ s => {
				if ( s && s !== '' ) {
					return new Promise( ( resolve ) => resolve( [
						{ id: '1234', title: 'foo', subtitle: 'oof', fullItem: {} },
						{ id: '4321', title: 'bar', image: { height: 30, width: 30, alt: 'image', url: 'https://www.placehold.co/30x30' }, fullItem: {} },
					] ) )
				}

				return new Promise( ( resolve ) => resolve( [] ) );
			} }
			select={ s => console.log(s) } />
	</main>
}