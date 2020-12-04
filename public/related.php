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

<div class="container">
    <div class="center">
        <div id="feedback"></div>
        <form id="related" class="form">
            <fieldset>
                <input type="text" name="search" id="search" placeholder="search...">
                <div id="dropdown"></div>
            </fieldset>
            <input type="hidden" name="artist" id="artist">
            <button id="cta">submit</button>
        </form>
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
            let timer;
            let searchDropdown = document.getElementById("dropdown");
            let artistInput = document.getElementById("artist");
            let form = document.getElementById('related');
            let searchBox = document.getElementById('search');
            let feedback = document.getElementById('feedback');

            form.addEventListener("submit", function(e){
                e.preventDefault();

                searchDropdown.style.display = "none";

                let artist = document.getElementById('artist').value;
                if (!artist) {
                    feedback.innerHTML = ("Please select from the dropdown");
                } else {
                    let artistID = document.getElementById('artist').value;

                    var ctaButton = document.getElementById('cta');
                    var originalText = ctaButton.innerHTML;
                    ctaButton.innerHTML = "loading...";
                    ctaButton.disabled = "true";
                    ajax("GET", "<?= $related->url ?>/related.class.php?refresh=<?= $related->refreshToken ?>&artist="+artistID, function(response){
                        feedback.innerHTML = response;
                        ctaButton.innerHTML = originalText;
                        ctaButton.removeAttribute('disabled');
                    });
                }

            })

            searchBox.addEventListener("keyup", () => {
                if (timer !== undefined) {
                    clearTimeout(timer);
                }

                timer = setTimeout(
                    () => {
                        let keyword = document.getElementById('search').value;

                        if (keyword != ""){
                            ajax(
                                "GET", 
                                "<?= $related->url ?>/related.class.php?refresh=<?= $related->refreshToken ?>&search="+keyword, 
                                function(response){
                                    let results = JSON.parse(response);
                                    artistInput.value = "";
                                    feedback.innerHTML = "";
                                    searchDropdown.innerHTML = "";
                                    searchDropdown.style.display = "flex";
                                    for (result of results) {
                                        let name = result.name;
                                        let option = document.createElement("div");
                                        option.classList.add("option");
                                        option.id = result.id;
                                        let optionInner = document.createElement("label");
                                        optionInner.innerHTML = result.name;
                                        let image = document.createElement("img");
                                        image.src = result.image;

                                        option.addEventListener("click", () => {
                                            artistInput.value = option.id;
                                            feedback.innerHTML = "You have selected <strong>"+name+"</strong>";
                                        });

                                        option.appendChild(image);
                                        option.appendChild(optionInner);
                                        searchDropdown.appendChild(option);
                                    }
                                }
                            );
                        }
                    }, 800
                )

            })
        }
    </script>
</body>