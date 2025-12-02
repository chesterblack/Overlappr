import { createContext, Dispatch, SetStateAction } from 'react';
import { Playlist, SetState, User } from './types';

interface MainContextType {
	accessToken: string
	setAccessToken: SetState<string>
	refreshToken: string
	setRefreshToken: SetState<string>
	tokenExpires: string
	setTokenExpires: SetState<string>
	user: User
	setUser: SetState<User>
	playlists: Playlist[]
	setPlaylists: SetState<Playlist[]>
}

const MainContext = createContext<MainContextType|null>( null );

export default MainContext;
