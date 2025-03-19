'use client'

import { useEffect, useState } from "react";
import { sendApiRequest } from "../lib/utilities";

export default function User() {
	const [ username, setUsername ] = useState( '' );
  useEffect(() => {
		( async() => {
			const response = await sendApiRequest('GET', '/auth');
			console.log(response);
		} )()
  }, [ setUsername ]);

  return (
		<span>
			Hi, {username}
		</span>
	)
}