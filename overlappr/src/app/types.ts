import { NextResponse } from "next/server"
import { Dispatch, ReactElement, SetStateAction } from "react"

export type SetState<StateType> = Dispatch<SetStateAction<StateType>>

export type Component = ReactElement | ReactElement[] | string

export type RestMethod = 'POST' | 'PATCH' | 'GET'

export type InternalApiResponse = Promise<NextResponse<{
	success: boolean
	message: any
}>>

export interface Image {
	height: number
	width: number
	url: string
}

export interface Playlist {
	id: string
	name: string
	external_urls: {
		spotify: string
	}
	tracks: {
		href: string
	}
	images: {
		[ key: number ]: Image
	}
}

export interface Track {
	id: string
	uri: string
}

export interface User {
	id: string
	display_name: string
}