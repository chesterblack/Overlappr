import { InternalApiResponse, RestMethod } from "../types";

export async function sendApiRequest(
	method: RestMethod,
	url: string,
	urlParams: any = null,
	body: any = null,
	options: any = {},
): Promise<any|void> {
	urlParams = urlParams ? new URLSearchParams( urlParams ) : '';

	options = {
		cache: "no-store",
		method,
		...options
	};

	if ([ 'POST', 'PATCH' ].includes( method ) && body) {
		options.body = JSON.stringify( body );
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
 */
export async function sendInternalApiRequest(
	method: RestMethod,
	endpoint: string,
	urlParams: any = null,
	body: any = null,
	options: any = {}
): InternalApiResponse {
	const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/${endpoint}`;
	return await sendApiRequest( method, url, urlParams, body, options );
}


/**
 * Makes an API request to a Spotify endpoint
 */
export async function sendSpotifyApiRequest(
	accessToken: string,
	method: RestMethod,
	endpoint: string,
	urlParams: any = null,
	body: any = null,
	options: any = {}
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


export async function fetchAllItems(
	accessToken: string,
	endpoint: string,
	itemsAttribute: string = 'items',
	nextAttribute: string = 'next'
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
			const parts = nextEndpoint.split( '?' );
			const endpoint = parts[0];
			const partsObj = parts.length > 1 ? parts[1].split( '&' ) : null;
			console.log( 'partsObj: ', partsObj );

			if ( ! partsObj ) {
				return;
			}

			const params = Object.fromEntries(
				partsObj.map( p => p.split( '=' ) )
			);

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


export function stripSpotifyBase( url: string ): string {
	if ( typeof url !== 'string' ) {
		return null;
	}

	return url.replace( 'https://api.spotify.com/v1/', '' );
}