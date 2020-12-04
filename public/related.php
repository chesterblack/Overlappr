<?php

    echo "<pre>";
    include_once(__DIR__."/related.class.php");
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

    <div id="feedback"></div>
    <form id="related">
        <input type="text" name="artist" id="artist">
        <button id="cta">submit</button>
    </form>
    
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
            var form = document.getElementById('related');
            form.addEventListener("submit", function(e){
                e.preventDefault();

                let artistID = document.getElementById('artist').value;

                var ctaButton = document.getElementById('cta');
                var originalText = ctaButton.innerHTML;
                ctaButton.innerHTML = "loading...";
                ctaButton.disabled = "true";
                ajax("GET", "<?= $related->url ?>/related.class.php?refresh=<?= $related->refreshToken ?>&artist="+artistID, function(response){
                    console.log(response);
                    document.getElementById('feedback').innerHTML = response;
                    ctaButton.innerHTML = originalText;
                    ctaButton.removeAttribute('disabled');
                });

            })
        }
    </script>

</body>