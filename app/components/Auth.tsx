"use client"

import MainContext from "../context";
import { useContext, useEffect } from "react";
import { useSearchParams } from 'next/navigation'
import { sendInternalApiRequest } from "../lib/utilities";
import Loading from "./Loading";
import { Component } from "../types";

interface Props {
	redirect_path?: string
}

export default function Auth( { redirect_path = '' }: Props ): Component {
	const { setAccessToken, setRefreshToken, setTokenExpires } = useContext(	MainContext );

	const searchParams = useSearchParams()
	const code = searchParams.get('code');

	useEffect( () => {
		( async () => {
			const redirect_uri = `${ process.env.NEXT_PUBLIC_SITE_URL }${ redirect_path }`;

			if ( ! code ) {
				window.location.assign( `https://accounts.spotify.com/authorize?client_id=${ process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID }&response_type=code&redirect_uri=${ redirect_uri }&scope=playlist-modify-private playlist-read-private` );
			}

			const response = await sendInternalApiRequest( 'GET', 'auth', {
				code,
				redirect_uri
			} );

			if ( response.success ) {
				setAccessToken( response.message.access_token );
				setRefreshToken( response.message.refresh_token );
				setTokenExpires( response.message.expires_in );
			}
		} )();
	}, [] );

	return <Loading />;
}