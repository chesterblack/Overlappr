'use client'

import { MouseEventHandler } from "react";

interface Props {
	callback?: MouseEventHandler<HTMLButtonElement>
	disabled?: boolean
}

export default function GoButton( { callback = () => {}, disabled = false }: Props ) {
	return(
		<button className="go-button" onClick={ callback } disabled={ disabled }>
			Go!
		</button>
	);
}