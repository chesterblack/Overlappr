<?php
    error_reporting(E_ALL);
    
    class Overlappr
    {
        
        public $authToken;
        public $refreshToken;
        public $userID = "1114234527";

        function makeRequest($method, $url, $data, $headers)
        {
            try {
                $options = array(
                    'http' => array(
                        'header'  => $headers,
                        'method'  => $method,
                        'content' => $data
                    )
                );
                $context  = stream_context_create($options);
                $result = file_get_contents($url, false, $context);
                
                return $result;
            } catch (Exception $e) {
                var_dump($e->getMessage());
            }
        }

        function getToken()
        {
            $requestBody = [
                "grant_type" => "authorization_code",
                "code" => $_GET['code'],
                "redirect_uri" => "http://localhost:5907",
                "scope" => "playlist-modify-private",
                "client_id" => "1a0e4dc230e3429d9ad538490df3d3f0",
                "client_secret" => "5968a94c7a3149ad9c56144af43fd842"
            ];

            $headers = "Content-type: application/x-www-form-urlencoded\r\n";

            $response = json_decode($this->makeRequest(
                "POST", 
                "https://accounts.spotify.com/api/token", 
                http_build_query($requestBody),
                $headers
            ));

            $this->authToken = $response->access_token;
            $this->refreshToken = $response->refresh_token;
        }

        function refreshToken(){
            $requestBody = [
                "grant_type" => "refresh_token",
                "refresh_token" => $this->refreshToken,
                "client_id" => "1a0e4dc230e3429d9ad538490df3d3f0",
                "client_secret" => "5968a94c7a3149ad9c56144af43fd842"
            ];

            $headers = "Content-type: application/x-www-form-urlencoded\r\n";

            $response = json_decode($this->makeRequest(
                "POST", 
                "https://accounts.spotify.com/api/token", 
                http_build_query($requestBody),
                $headers
            ));

            $token = $response->access_token;

            return $token;
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
                $ids[] = $song->track->id;
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

        function createPlaylist($name)
        {
            $authToken = $this->refreshToken();
            $url = "https://api.spotify.com/v1/users/".$this->userID."/playlists";

            $data = [
                "name" => $name,
                "public" => false
            ];

            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";

            $newPlaylist = $this->makeRequest(
                "POST",
                $url,
                json_encode($data),
                $headers
            );

            return ($newPlaylist);
        }
        function addSongsToPlaylist($playlist, $songs)
        {
            $authToken = $this->refreshToken();
            $url = "https://api.spotify.com/v1/playlists/".$playlist."/tracks";

            $data = [
                "uris" => $songs,
                "position" => 0
            ];

            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";

            $newPlaylist = $this->makeRequest(
                "POST",
                $url,
                json_encode($data),
                $headers
            );

            return ($newPlaylist);
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

                $newPlaylist = json_decode($this->createPlaylist($newPlaylistName));
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


    if (isset($_GET['refresh'])) {
        $overlappr->refreshToken = $_GET['refresh'];
        $playlists = json_decode($_GET['playlists']);
        $newPlaylist = $overlappr->handlePlaylists($playlists);
        $userResponse = "<strong>".$newPlaylist->name."</strong> has been created <a target=\"_blank\" href=\"".$newPlaylist->external_urls->spotify."\">view new playlist</a><br />";
        echo $userResponse;
    } else {
        $overlappr->getToken();
    }

?>