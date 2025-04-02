'use client'

import { useContext, useEffect, useState } from "react";
import { sendSpotifyApiRequest } from "../lib/utilities";
import MainContext from "../context";

export default function User() {
	const { accessToken, user, setUser } = useContext( MainContext );

	useEffect( () => {
		( async() => {
			if ( ! user ) {
				const userData = await sendSpotifyApiRequest( accessToken, 'GET', 'me' );
				setUser( userData );
			}
		} )()
	}, [] );

	return ( user?.display_name && <span>Hi, { user.display_name }</span> )
}
