export async function sendApiRequest(
	method,
	url,
	urlParams = null,
	body = null,
	options = {}
) {
	urlParams = urlParams ? new URLSearchParams( urlParams ) : '';

	options = {
		cache: "no-store",
		method,
		...options
	};

	if ([ 'POST', 'PATCH' ].includes(method) && body) {
		options.body = JSON.stringify(body);
	}

	return await fetch( `${ url }?${ urlParams }`, options )
		.then( res => res.json() )
		.catch( ( error ) => {
			console.error( error );
			return error;
		} );
}


/**
 * Send a request to this site's API
 *
 * @param { string } method
 * @param { string } endpoint 
 * @param { Object } [urlParams] 
 * @param { Object } [body] 
 * @param { Object } [options]
 *
 * @returns { NextResponse }
 */
export async function sendInternalApiRequest(
	method,
	endpoint,
	urlParams = null,
	body = null,
	options = {}
) {
	const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/${endpoint}`;
	return await sendApiRequest( method, url, urlParams, body, options );
}


/**
 * Makes an API request to a Spotify endpoint
 */
export async function sendSpotifyApiRequest(
	accessToken,
	method,
	endpoint,
	urlParams = null,
	body = null,
	options = {}
) {
	if ( ! accessToken ) {
		throw new Error( 'No access token passed through to sendSpotifyApiRequest' );
	}

	const url = `https://api.spotify.com/v1/${ endpoint }`;
	const headers = options.headers ?? {};
	options = {
		headers: {
			...headers,
			Authorization: 'Bearer ' + accessToken
		}
	};

	return await sendApiRequest( method, url, urlParams, body, options );
}


export async function recursivelyFetchItems(
	accessToken,
	endpoint,
	itemsAttribute = 'items',
	nextAttribute = 'next'
) {
	const firstList = await sendSpotifyApiRequest(
		accessToken,
		'GET',
		endpoint
	);

	let items = firstList[ itemsAttribute ];

	if ( firstList[ nextAttribute ] ) {
		let nextEndpoint = stripSpotifyBase( firstList[ nextAttribute ] );

		while ( nextEndpoint ) {
			const parts = nextEndpoint.split('?');
			const endpoint = parts[0];
			let params = parts.length > 1 ? parts[1].split( '&' ) : {};
			params = Object.fromEntries(
				params.map( p => p.split( '=' ) )
			);

			console.log( 'endpoint: ', endpoint );
			console.log( 'params: ', params );
			console.log( '---');

			const newList = await sendSpotifyApiRequest(
				accessToken,
				'GET',
				endpoint,
				params
			);

			items = [ ...items, ...newList[ itemsAttribute ] ];

			nextEndpoint = stripSpotifyBase( newList?.[ nextAttribute ] );
		}
	}

	return items;
}


function stripSpotifyBase( url ) {
	if ( typeof url !== 'string' ) {
		return null;
	}

	return url.replace( 'https://api.spotify.com/v1/', '' );
}