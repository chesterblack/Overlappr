<?php 
    include_once(__DIR__."/findr.class.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Findr</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="findr container">
    <div class="center">
        <h1>
            Findr
        </h1>

        <h2 id="feedback"><?= $userResponse ?? ""; ?>
            Which playlists is this song in?
        </h2>

        <form id="findr">
            <input type="text" name="song" id="song">
            <button id="cta">
                submit
            </button>
        </form>
    </div>
    <span class="logged-in">Logged in as <?= $findr->userObj->display_name ?></span>
    <div class="line-1"></div>
    <div class="line-2"></div>
</div>
    <script>
        function ajax(method, url, callback, data){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                console.log(this.status);
                if (this.readyState == 4) {
                    callback(this.responseText);
                }
            };

            xhttp.open(method, url, true);

            if (method == "POST") {
                xhttp.send(data);
            } else {
                xhttp.send();
            }
        }

        window.onload = function(){
            var form = document.getElementById('findr');
            form.addEventListener("submit", function(e){
                e.preventDefault();

                var selectValues = [];
                var selects = document.getElementsByTagName('select');
                for (var i = 0; i < selects.length; i++) {
                    selectValues.push(selects[i].options[selects[i].selectedIndex].value);
                }
                
                let songID = document.getElementById('song').value;

                var ctaButton = document.getElementById('cta');
                var originalText = ctaButton.innerHTML;
                ctaButton.innerHTML = "loading...";
                ctaButton.disabled = "true";
                ajax("GET", "<?= $findr->url ?>/findr.class.php?refresh=<?= $findr->refreshToken ?>&songID="+songID, function(response){
                    console.log(response);
                    if (typeof playlists == "object") {
                        let playlists = JSON.parse(response);
                        for (playlist in playlists) {
                            document.getElementById('feedback').innerHTML += playlist + "<br>";
                        }
                    } else {
                        document.getElementById('feedback').innerHTML = response;
                    }
                    ctaButton.innerHTML = originalText;
                    ctaButton.removeAttribute('disabled');
                });

            })
        }
    </script>
</body>
</html>