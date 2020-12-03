<?php
    require_once(__DIR__."/spotify-api.class.php");
    
    class Related extends SpotifyAPI
    {
        function getRelatedArtists($artistID)
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";

            $relatedArtists = $this->makeRequest(
                "GET",
                "https://api.spotify.com/v1/artists/".$artistID."/related-artists",
                null,
                $headers
            );

            return json_decode($relatedArtists)->artists;
        }

        function getTopTracks($artistID)
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";
    
            $topTracks = $this->makeRequest(
                "GET",
                "https://api.spotify.com/v1/artists/".$artistID."/top-tracks?country=GB",
                null,
                $headers
            );

            return json_decode($topTracks)->tracks;
        }
    
        function topTracksFromRelated($artistID)
        {
            $relatedArtists = $this->getRelatedArtists($artistID);
    
            $topTracksIDs = [];
            foreach ($relatedArtists as $artist) {
                $topTracks = $this->getTopTracks($artist->id);
    
                foreach ($topTracks as $track) {
                    $topTracksIDs[] = $track->id;
                }
            }
    
            return $topTracksIDs;
        }

        function handlePlaylist($name, $artistID)
        {
            $newPlaylist = json_decode($this->createPlaylist($name));
            $trackListURIs = [];
            $tracks = $this->topTracksFromRelated($artistID);
            foreach ($tracks as $track) {
                $trackListURIs[] = "spotify:track:".$track;
            }

            $group1 = array_slice($trackListURIs, 0, 99);
            $group2 = array_slice($trackListURIs, 100, 199);

            $this->addSongsToPlaylist($newPlaylist->id, $group1);
            $newPlaylist = $this->addSongsToPlaylist($newPlaylist->id, $group2);

            return $newPlaylist;
        }
    }


    $related = new Related();

    if (isset($_GET['refresh'])) {
        $related->refreshToken = $_GET['refresh'];
    } elseif(isset($_COOKIE['refresh_token'])) {
        $related->refreshToken = $_COOKIE['refresh_token'];
    } elseif(isset($_GET['code'])) {
        $related->getToken("playlist-modify-private");
        if (!$related->authToken) {
            echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$related->url."&scope=playlist-modify-private playlist-read-private';</script>";
            exit;
        }
    } else {
        echo "<script>window.location.href='https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=".$related->url."&scope=playlist-modify-private playlist-read-private';</script>";
        exit;
    }

    var_dump($related->handlePlaylist("Related to Polaris", "0v2e0oznnTaIXKLGKHphfX"));