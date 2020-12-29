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
                $songs = $this->getSongs($playlist->id);
                $songIDs = $this->getSongListIDs($songs);
    
                if (in_array($needleSong, $songIDs)) {
                    $playlistsSongIsIn[] = $playlist;
                }
            }

            if (count($playlistsSongIsIn) > 0) {
                return $this->getPlaylistNames($playlistsSongIsIn);
            } else {
                return false;
            }
        }
    }

    $findr = new Findr();

    if (isset($_GET['songID'])) {
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