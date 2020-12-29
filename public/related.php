<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discovr</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
<?php
    echo "<pre>";
    include_once("related.class.php");
    echo "</pre>";
?>

<div class="discovr container">
    <div class="center">
        <h1>
            Discovr
        </h1>

        <h2 id="feedback"><?= $userResponse ?? ""; ?>
            Start typing and select from the dropdown to quickly make a playlist out of the top tracks of all related artists
        </h2>

        <div id="feedback"></div>
        <form id="related" class="form">
            <fieldset>
                <input type="text" name="search" id="search" placeholder="search...">
                <div id="dropdown" style="display:none"></div>
            </fieldset>
            <input type="hidden" name="artist" id="artist">
            <button id="cta">create new playlist</button>
        </form>
    </div>
    <span class="logged-in">Logged in as <?= $related->userObj->display_name ?></span>

    <div class="line-1"></div>
    <div class="line-2"></div>
    <div class="line-3"></div>
    <div class="line-4"></div>
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

                if (!searchBox.value) {
                    searchDropdown.style.display = "none";
                    searchBox.classList.remove("open");
                }

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
                            searchDropdown.style.display = "flex";
                            searchBox.classList.add("open");
                            searchDropdown.innerHTML = "Loading...";
                            
                            ajax(
                                "GET", 
                                "<?= $related->url ?>/related.class.php?refresh=<?= $related->refreshToken ?>&search="+keyword, 
                                function(response){
                                    let results = JSON.parse(response);
                                    searchDropdown.innerHTML = "";
                                    searchDropdown.style.display = "flex";
                                    searchBox.classList.add("open");
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
                    }, 400
                )

            })
        }
    </script>
</body>
</html>