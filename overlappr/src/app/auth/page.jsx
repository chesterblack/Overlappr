"use client"

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { sendApiRequest } from "../lib/utilities";

export default function AuthPage({ request }) {
  const searchParams = useSearchParams()
  const code = searchParams.get('code');

  console.log( 'code: ', code );

  useEffect( () => {
    ( async () => {
      const redirect_uri = `${ process.env.NEXT_PUBLIC_SITE_URL }/auth`;
  
      if ( !code ) {
        window.location.assign( `https://accounts.spotify.com/authorize?client_id=${ process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID }&response_type=code&redirect_uri=${ redirect_uri }&scope=playlist-modify-private playlist-read-private` );
      }
  
      // sendApiRequest( 'GET', '/auth', { code, redirect_uri } );
  
      const encodedKeys = btoa(
        `${ process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID }:2f9da11f2254433999475b5ddc93db0f`
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
      ).then( res => res.text() );

      console.log( 'response: ', response );
    } )()

  }, [] );

  return "Loading..."
}