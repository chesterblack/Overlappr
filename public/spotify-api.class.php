<?php
    class SpotifyAPI
    {
        public $authToken;
        public $refreshToken;
        protected $env;

        function __construct()
        {
            require_once __DIR__ . '/../vendor/autoload.php';
            $dotenv = Dotenv\Dotenv::createImmutable(dirname($_SERVER['DOCUMENT_ROOT']));
            $dotenv->load();
            $this->env = $_ENV;
            $this->url = $_ENV['url'];
        }

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

        function getToken($scope)
        {
            $requestBody = [
                "grant_type" => "authorization_code",
                "code" => $_GET['code'],
                "redirect_uri" => $this->url,
                "scope" => $scope,
                "client_id" => $this->env['client_id'],
                "client_secret" => $this->env['client_secret']
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

            setCookie("refresh_token", $response->refresh_token, time() + (86400 * 7), "/");
            return $this->authToken;
        }

        function refreshToken(){
            $requestBody = [
                "grant_type" => "refresh_token",
                "refresh_token" => $this->refreshToken,
                "client_id" => $this->env['client_id'],
                "client_secret" => $this->env['client_secret']            
            ];

            $headers = "Content-type: application/x-www-form-urlencoded\r\n";

            $response = json_decode($this->makeRequest(
                "POST", 
                "https://accounts.spotify.com/api/token", 
                http_build_query($requestBody),
                $headers
            ));

            $token = $response->access_token;

            $this->setUserID($token);

            return $token;
        }

        function setUserID($authToken) {
            $headers = "Authorization: Bearer ".$authToken."\r\n";

            $user = json_decode($this->makeRequest(
                "GET",
                "https://api.spotify.com/v1/me",
                null,
                $headers
            ));

            $this->userObj = $user;
            $this->userID = $user->id;
            return $this->userID;
        }

        function createPlaylist($name)
        {
            $authToken = $this->refreshToken();
            $url = "https://api.spotify.com/v1/users/".$this->userID."/playlists";

            $data = [
                "name" => $name,
                "public" => false,
                "description" => "Created using Overlappr"
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
    }