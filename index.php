<?php

    error_reporting(E_ALL);
    echo "hello world";

?>

<script>
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
</script>