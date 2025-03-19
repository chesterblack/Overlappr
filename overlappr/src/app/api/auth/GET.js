import { NextResponse } from "next/server";

export default async function authEndpointGet( request ) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code');
	const redirect_uri = searchParams.get('redirect_uri');

	const encodedKeys = btoa(
		`${ process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID }:${ process.env.SPOTIFY_CLIENT_SECRET }`
	);

	const data = {
		grant_type: 'authorization_code',
		code: code,
		redirect_uri: redirect_uri
	}

	let formBody = [];
	for (let property in data) {
		const encodedKey = encodeURIComponent( property );
		const encodedValue = encodeURIComponent( data[ property ] );
		formBody.push( encodedKey + "=" + encodedValue );
	}
	formBody = formBody.join("&");

	const response = await fetch(
		'https://accounts.spotify.com/api/token',
		{
			cache: 'no-store',
			method: 'POST',
			body: formBody,
			headers: {
				Authorization: `Basic ${ encodedKeys }`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	)

	const responseBody = await response.json();

	return NextResponse.json({
		success: response.ok,
		message: responseBody
	});
}
