<?php
    require_once(__DIR__."/spotify-api.class.php");
        
    class Findr extends SpotifyAPI
    {
        public $userObj;
        public $userID;

        function findPlaylistsSongIsIn($needleSong) {
            $playlistsSongIsIn = [];
            $playlists = $this->getPlaylists();
            foreach ($playlists as $playlist) {
                $songIDs = array_map(function($e) {
                    return $e->track->id;
                }, $this->getSongs($playlist->id));

                if (in_array($needleSong, $songIDs)) {
                    $playlistsSongIsIn[] = $playlist;
                }
            }

            if (count($playlistsSongIsIn) > 0) {
                $formattedResponse = [];
                foreach ($playlistsSongIsIn as $playlist) {
                    $formattedResponse[] = [
                        "name" => $playlist->name,
                        "url" => $playlist->external_urls->spotify
                    ];
                }
                return $formattedResponse;
            } else {
                return false;
            }
        }

        function getSearchResults($searchTerm)
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";

            $searchTerm = urlencode($searchTerm);

            $searchResults = $this->makeRequest(
                "GET",
                "https://api.spotify.com/v1/search?type=track&limit=5&q=".$searchTerm,
                null,
                $headers
            );

            $formattedResults = [];
            $searchResults = json_decode($searchResults)->tracks->items;
            $i = 0;
            foreach ($searchResults as $result) {
                $formattedResults[$i] = [
                    "id" => $result->id,
                    "name" => $result->name,
                    "artist" => $result->artists[0]->name
                ];

                if (isset($result->album->images[0])) {
                    $formattedResults[$i]["image"] = $result->album->images[0]->url;
                } else {
                    $formattedResults[$i]["image"] = "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=";
                }

                $i++;
            };

            return json_encode($formattedResults);
        }
    }

    $findr = new Findr();

    if (isset($_GET['refresh']) && isset($_GET['search'])) {
        $findr->refreshToken = $_GET['refresh'];
        $searchResults = $findr->getSearchResults($_GET['search']);
        echo $searchResults;
    } elseif (isset($_GET['refresh']) && isset($_GET['songID'])) {
        $findr->refreshToken = $_GET['refresh'];
        $needleSong = $_GET['songID'];
        $playlistNames = $findr->findPlaylistsSongIsIn($needleSong);

        if ($playlistNames) {
            echo json_encode($playlistNames);
        } else {
            echo "Song not found in any of your playlists";
        }

    } elseif (isset($_COOKIE['refresh_token'])) {
        $findr->refreshToken = $_COOKIE['refresh_token'];
        $findr->refreshToken();
    } elseif (isset($_GET['code'])) {
        $findr->getToken("playlist-modify-private", $findr->env['url']);
        if (!$findr->authToken) {
            echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$findr->env['findr_url']."&scope=playlist-modify-private playlist-read-private';</script>";
            exit;
        }
    } else {
        echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$findr->env['findr_url']."&scope=playlist-modify-private playlist-read-private';</script>";
        exit;    
    }