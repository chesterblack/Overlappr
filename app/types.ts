import { Dispatch, ReactElement, SetStateAction } from "react"

export type SetState<StateType> = Dispatch<SetStateAction<StateType>>

export type Component = ReactElement | ReactElement[] | string

export type RestMethod = 'POST' | 'PATCH' | 'GET'

export type InternalApiResponse = Promise<{
	success: boolean
	message: any
}>

export interface User {
	id: string
	display_name: string
}

export interface Image {
	height: number
	width: number
	url: string
}

export interface ExternalUrls {
	spotify: string
}

export interface SpotifyItem {
	id: string
	name: string
	external_urls: ExternalUrls
	href: string
	uri: string
}

export interface Playlist extends SpotifyItem {
	tracks: {
		href: string
	}
	images: {
		[ key: number ]: Image
	}
}

export interface Artist extends SpotifyItem {}

export interface Album extends SpotifyItem {
	artists: Artist[]
	images: {
		[ key: number ]: Image
	}
	release_date: string
	total_tracks: number
}

export interface Track extends SpotifyItem {
	artists: Artist[]
	album: Album
	explicit: boolean
}