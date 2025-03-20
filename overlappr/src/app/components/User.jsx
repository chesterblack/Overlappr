'use client'

import { useContext, useEffect, useState } from "react";
import { sendSpotifyApiRequest } from "../lib/utilities";
import MainContext from "../context";

export default function User() {
	const { accessToken } = useContext( MainContext );
	const [ username, setUsername ] = useState();

	useEffect( () => {
		( async() => {
			const { display_name } = await sendSpotifyApiRequest(
				'me',
				accessToken
			);
			setUsername( display_name );
		} )()
	}, [] );

	return ( username && <span>Hi, { username }</span> )
}
