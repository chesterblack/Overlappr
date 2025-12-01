import { NextResponse } from "next/server"
import { Dispatch, ReactElement, SetStateAction } from "react"

export type SetState<StateType> = Dispatch<SetStateAction<StateType>>

export type Component = ReactElement | ReactElement[] | string

export type RestMethod = 'POST' | 'PATCH' | 'GET'

export type InternalApiResponse = Promise<NextResponse<{
	success: boolean
	message: any
}>>

export interface Playlist {
	id: string
	name: string
	external_urls: {
		spotify: string
	}
}

export interface User {
	id: string
	display_name: string
}