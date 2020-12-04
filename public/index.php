<?php 
    // ini_set("display_errors", "1");
    // error_reporting(E_ALL);
    echo "<pre>";
    include_once(__DIR__."/overlappr.class.php");
    echo "</pre>";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Overlappr</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
    <div class="center">
        <h1>
            Overlappr
        </h1>

        <h2 id="feedback"><?= $userResponse ?? ""; ?>
            Create a new playlist out of songs that are in both source playlists
        </h2>

        <form id="overlappr">
            <div class="form">
                <?php $overlappr->displayOptions() ?>
            </div>
            <button id="cta">
                create new playlist
            </button>
        </form>
        <span>Logged in as <?= $overlappr->userObj->display_name ?></span>
    </div>
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
            var form = document.getElementById('overlappr');
            form.addEventListener("submit", function(e){
                e.preventDefault();

                var selectValues = [];
                var selects = document.getElementsByTagName('select');
                for (var i = 0; i < selects.length; i++) {
                    selectValues.push(selects[i].options[selects[i].selectedIndex].value);
                }
                var formData = JSON.stringify(selectValues);

                var ctaButton = document.getElementById('cta');
                var originalText = ctaButton.innerHTML;
                ctaButton.innerHTML = "loading...";
                ctaButton.disabled = "true";
                ajax("GET", "<?= $overlappr->url ?>/overlappr.class.php?refresh=<?= $overlappr->refreshToken ?>&playlists="+formData, function(response){
                    // console.log(response);
                    document.getElementById('feedback').innerHTML = response;
                    ctaButton.innerHTML = originalText;
                    ctaButton.removeAttribute('disabled');
                }, formData);

            })
        }
    </script>
</body>
</html>