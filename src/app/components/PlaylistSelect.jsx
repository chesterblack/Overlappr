"use client"

import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/main-context";

export default function PlaylistSelect({}) {
  const [ allPlaylists, setAllPlaylists ] = useState([]);
  const [ selectedPlaylist, setSelectedPlaylist ] = useState();
  const [ searchResults, setSearchResults ] = useState([]);
  const { token } = useContext( MainContext );

  useEffect(() => {
    (async () => {
      async function findPlaylists( playlists, url = 'https://api.spotify.com/v1/me/playlists' ) {
        const response = await axios.get( url, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            limit: 50
          }
        });
        
        playlists = [ ...playlists, ...response.data.items ];
  
        if ( response.next ) {
          findPlaylists( playlists, response.next );
        } else {
          return playlists;
        }
      }
  
      const playlists = await findPlaylists([]);
      setAllPlaylists( playlists );
      setSearchResults( playlists );
    })()
  }, [ token ]);

  return (
    <>
      <input
        className={searchResults.length > 0 ? 'open' : ''}
        type="text"
        placeholder="Search for a playlist"
        onChange={(e) => {
          const inputValue = e.target.value;
          if ( ! inputValue ) {
            setSearchResults([]);
            return;
          }

          let matchedPlaylists = [];
          allPlaylists.forEach(( playlist ) => {
            if ( playlist.name.match( new RegExp(`^${ inputValue }.+`, 'i') ) ) {
              console.log('match!', playlist.name);
              matchedPlaylists.push( playlist );
            }
          });

          setSearchResults( matchedPlaylists );
        }}
      />
      {searchResults.length > 0 &&
        <div className='search-results-container'>
          <div className='search-results'>
            {
              searchResults.map(( playlist ) => {
                return <div className='playlist' key={playlist.id}>{playlist.name}</div>;
              })
            }
          </div>
        </div>
      }
    </>
  );
}