<?php
    echo "<pre>";
    error_reporting(E_ALL);
    
    class Overlappr
    {
        
        public $authToken;
        public $refreshToken;

        function makeRequest($method, $url, $data, $headers)
        {
            try {
                $options = array(
                    'http' => array(
                        'header'  => $headers,
                        'method'  => $method,
                        'content' => $data ? http_build_query($data) : null
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
                "client_id" => "1a0e4dc230e3429d9ad538490df3d3f0",
                "client_secret" => "5968a94c7a3149ad9c56144af43fd842"
            ];

            $headers = "Content-type: application/x-www-form-urlencoded\r\n";

            $response = json_decode($this->makeRequest(
                "POST", 
                "https://accounts.spotify.com/api/token", 
                $requestBody, 
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
                $requestBody,
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
                "https://api.spotify.com/v1/users/1114234527/playlists",
                null,
                $headers
            );

            $playlists = json_decode($playlists);

            return $playlists->items;

            // var_dump($playlists->items[0]->id);
        }

        function getSongs($playlistID)
        {
            $authToken = $this->refreshToken();
            $headers = "Accept: application/json\r\n";
            $headers .= "Content-Type: application/json\r\n";
            $headers .= "Authorization: Bearer ".$authToken."\r\n";
            
            $songs = $this->makeRequest(
                "GET", 
                "https://api.spotify.com/v1/playlists/".$playlistID."/tracks",
                null,
                $headers
            );

            $songs = json_decode($songs);

            return $songs->items;
        }

        function handlePlaylists(){
            $this->getToken();
            $playlists = $this->getPlaylists();

            $playlistID = $playlists[0]->id;

            $songs = $this->getSongs($playlistID);
            $songIDs = [];

            foreach($songs as $song){
                $songIDs[] = $song->track->id;
            }

            // for ($i = 0; $i < count($playlists); $i++) {
            //     $id = $playlists[$i]->id;
            //     $songs = getSongs();
            // }
        }
    }

    $overlappr = new Overlappr();

    $overlappr->handlePlaylists();

?>

<!-- <script>
    function ajax(method, url, callback, data, auth) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            // console.log(this.status);
            if (this.readyState == 4) {
                if (this.status == 400) {
                    window.location.href = "https://accounts.spotify.com/en/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=http:%2F%2Flocalhost:5907";
                    // callback(this.responseText);
                } else {
                    callback(this.responseText);
                }
            }
        };

        xhttp.open(method, url, true);
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        if (auth) {
            xhttp.setRequestHeader('Authorization', auth);
        }

        if (method == "POST") {
            xhttp.send(data);
        } else {
            xhttp.send();
        }
    }

    function handlePlaylists(authToken) {
        ajax("GET", "https://api.spotify.com/v1/users/1114234527/playlists", function(response) {
            console.log(JSON.parse(response).items);
        }, "", "Bearer "+authToken);
    }

    function getToken(callback) {
        var data = "grant_type=authorization_code&code=<?= $_GET['code'] ?>&redirect_uri=http://localhost:5907&client_id=1a0e4dc230e3429d9ad538490df3d3f0&client_secret=5968a94c7a3149ad9c56144af43fd842";


        var tokenResponse = ajax("POST", "https://accounts.spotify.com/api/token", function(response) {
            var authToken = JSON.parse(response).access_token;
            callback(authToken);
        }, data);

    }
    
    window.onload = getToken(handlePlaylists);
</script> -->