<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <?php 
        include_once("overlappr.class.php");

        if (isset($_COOKIE['playlists'])) {
            $playlists = json_decode($_COOKIE['playlists'])->playlists;
            $newPlaylist = $overlappr->handlePlaylists($playlists);
            $userResponse = $newPlaylist->name." has been created <a target=\"_blank\" href=\"".$newPlaylist->external_urls->spotify."\">view new playlist</a>";    
        }
    ?>


    <a href="https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=http://localhost:5907&scope=playlist-modify-private" class="refresh">
        refresh
    </a>
    <div class="container">

        <h1>
            Overlappr
        </h1>

        <h2 id="response"><?= $userResponse; ?></h2>

        <form id="overlappr">
            <div class="form">
                <?php $overlappr->displayOptions() ?>
            </div>
            <button>
                create new playlist
            </button>
        </form>
    </div>

    <script>
        window.onload = function(){
            var form = document.getElementById('overlappr');
            form.addEventListener("submit", function(e){
                e.preventDefault();

                var selectValues = [];
                var selects = document.getElementsByTagName('select');
                for (var i = 0; i < selects.length; i++) {
                    selectValues.push(selects[i].options[selects[i].selectedIndex].value);
                }

                formData = {
                    "playlists": selectValues
                };

                formData = JSON.stringify(formData);

                document.cookie = "playlists="+formData+"; max-age=5; path=/";

                window.location = "https://accounts.spotify.com/authorize?client_id=1a0e4dc230e3429d9ad538490df3d3f0&response_type=code&redirect_uri=http://localhost:5907&scope=playlist-modify-private";
            })
        }
    </script>

</body>
</html>