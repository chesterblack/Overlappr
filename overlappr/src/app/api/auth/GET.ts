import { NextRequest, NextResponse } from "next/server";
import { InternalApiResponse } from "../../types";

export default async function authEndpointGet( request: NextRequest ): InternalApiResponse {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get( 'code' );
	const redirect_uri = searchParams.get( 'redirect_uri' );

	const encodedKeys = btoa(
		`${ process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID }:${ process.env.SPOTIFY_CLIENT_SECRET }`
	);

	const data = { grant_type: 'authorization_code', code, redirect_uri };

	let formBodyArr = [];
	for (let property in data) {
		const encodedKey = encodeURIComponent( property );
		const encodedValue = encodeURIComponent( data[ property ] );
		formBodyArr.push( encodedKey + '=' + encodedValue );
	}
	const formBodyStr = formBodyArr.join( '&' );

	const response = await fetch(
		'https://accounts.spotify.com/api/token',
		{
			cache: 'no-store',
			method: 'POST',
			body: formBodyStr,
			headers: {
				Authorization: `Basic ${ encodedKeys }`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);

	const responseBody = await response.json();

	return NextResponse.json({
		success: response.ok,
		message: responseBody
	});
}
