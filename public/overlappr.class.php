<?php
    require_once(__DIR__."/spotify-api.class.php");
    
    class Overlappr extends SpotifyAPI
    {
        public $userObj;
        public $userID;

        function __construct() 
        {
            parent::__construct();
            $this->url = $this->env['overlappr_url'];
        }    

        function getPlaylists()
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";
            
            $playlists = $this->makeRequest(
                "GET", 
                "https://api.spotify.com/v1/users/".$this->userID."/playlists?limit=50",
                null,
                $headers
            );

            $playlists = json_decode($playlists);

            return $playlists->items;
        }

        function getPlaylistNames($playlists)
        {
            $playlistNames = [];
            foreach($playlists as $playlist) {
                $playlistNames[] = $playlist->name;
            }
            return $playlistNames;
        }

        function getSongs($playlistID, $iteration = 0)
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";

            $offset = $iteration * 100;
            
            $songs = $this->makeRequest(
                "GET", 
                "https://api.spotify.com/v1/playlists/".$playlistID."/tracks?offset=".$offset,
                null,
                $headers
            );

            $songs = json_decode($songs);

            return $songs->items;
        }

        function getSongListIDs($songs)
        {
            $ids = [];
            foreach($songs as $song){
                if ($song->track->id) {
                    $ids[] = $song->track->id;
                }
            }
            return $ids;
        }

        function getPlaylistID($playlistName)
        {
            $allPlaylists = $this->getPlaylists();

            foreach($allPlaylists as $playlist) {
                if ($playlist->name == $playlistName) {
                    return $playlist->id;
                }
            }
        }

        function getOverlap($selectedPlaylists)
        {
            if (count($selectedPlaylists) != 2) {
                echo "Has to be two playlists selected (for now)";
            } else {
                $activePlaylists = [];
    
                for ($i = 0; $i < count($selectedPlaylists); $i++) {
                    $id = $this->getPlaylistID($selectedPlaylists[$i]);
                    $songsList = $this->getSongs($id, 0);
                    $iterationCounter = 1;


                    while (count($songsList) / $iterationCounter == 100) {
                        $newSongs = $this->getSongs($id, $iterationCounter);
                        $songsList = array_merge($newSongs, $songsList);
                        $iterationCounter++;
                    }

                    $songIDs = $this->getSongListIDs($songsList);
                    $activePlaylists[$i] = $songIDs;
                }

                $newPlaylist = array_intersect($activePlaylists[0], $activePlaylists[1]);
                return $newPlaylist;
            }
        }

        function checkIfPlaylistExists($playlistName)
        {
            $playlistExists = false;
            $allPlaylists = $this->getPlaylists();
            foreach ($allPlaylists as $playlist) {
                if ($playlist->name == $playlistName) {
                    $playlistExists = true;
                }
            }

            return $playlistExists;
        }

        function handlePlaylists($selectedPlaylists)
        {
            $newPlaylistName = "";
            foreach ($selectedPlaylists as $playlist) {
                $newPlaylistName .= $playlist . " x ";
            }
            $newPlaylistName = rtrim($newPlaylistName, "x ");

            $alreadyExists = $this->checkIfPlaylistExists($newPlaylistName);
            if (!$alreadyExists) {
                $newSongList = $this->getOverlap($selectedPlaylists);
                $songListURIs = [];
                foreach ($newSongList as $song) {
                    $songListURIs[] = "spotify:track:".$song;
                }

                $newPlaylist = json_decode($this->createPlaylist($newPlaylistName, "Created using Overlappr"));
                $completedPlaylist = $this->addSongsToPlaylist($newPlaylist->id, $songListURIs);
                return $newPlaylist;
            }
        }

        function displayOptions() {
            $playlists = $this->getPlaylists();
            $playlistNames = $this->getPlaylistNames($playlists);
            for ($i = 0; $i < 2; $i++) {
                echo "<div class=\"select\"><select>";
                foreach ($playlistNames as $playlist) {
                    echo "<option value=\"$playlist\">$playlist</option>";
                }
                echo "</select></div>";
            }
        }
    }

    $overlappr = new Overlappr();

    // error_reporting(E_ALL);

    if (isset($_GET['refresh']) && $_GET['playlists']) {
        $overlappr->refreshToken = $_GET['refresh'];
        $playlists = json_decode($_GET['playlists']);
        $newPlaylist = $overlappr->handlePlaylists($playlists);
        $userResponse = "<strong>".$newPlaylist->name."</strong> has been created <a target=\"_blank\" href=\"".$newPlaylist->external_urls->spotify."\">view new playlist</a><br />";
        echo $userResponse;
    } elseif(isset($_COOKIE['refresh_token'])) {
        $overlappr->refreshToken = $_COOKIE['refresh_token'];
    } elseif(isset($_GET['code'])) {
        $overlappr->getToken("playlist-modify-private");
        if (!$overlappr->authToken) {
            echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$overlappr->url."&scope=playlist-modify-private playlist-read-private';</script>";
            exit;
        }
    } else {
        echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$overlappr->url."&scope=playlist-modify-private playlist-read-private';</script>";
        exit;    
    }

?>