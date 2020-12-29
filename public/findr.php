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

        <form id="findr" class="form">
            <fieldset>
                <input type="text" name="search" id="search" placeholder="search...">
                <div id="dropdown" style="display:none"></div>
            </fieldset>
            <input type="hidden" name="song" id="song">
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

        window.onload = function(){
            let timer;
            let searchDropdown = document.getElementById("dropdown");
            let artistInput = document.getElementById("song");
            let form = document.getElementById('findr');
            let searchBox = document.getElementById('search');
            let feedback = document.getElementById('feedback');

            form.addEventListener("submit", function(e){
                e.preventDefault();

                if (!searchBox.value) {
                    searchDropdown.style.display = "none";
                    searchBox.classList.remove("open");
                }

                let artist = document.getElementById('song').value;
                if (!artist) {
                    feedback.innerHTML = ("Please select from the dropdown");
                } else {
                    let songID = document.getElementById('song').value;

                    var ctaButton = document.getElementById('cta');
                    var originalText = ctaButton.innerHTML;
                    ctaButton.innerHTML = "loading...";
                    ctaButton.disabled = "true";
                    ajax("GET", "<?= $findr->url ?>/findr.class.php?refresh=<?= $findr->refreshToken ?>&songID="+songID, function(response){
                        playlists = JSON.parse(response);
                        console.log(playlists);
                        if (playlists[0]) {
                            feedback.innerHTML = "That song was found in the following playlists<br />";
                            for (let i = 0; i < playlists.length; i++) {
                                feedback.innerHTML += "<a href='" + playlists[i].url + "' target='_blank'>" + playlists[i].name;
                            }
                        } else {
                            feedback.innerHTML = "That song was not found in any of your playlists";
                        }
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
                                "<?= $findr->url ?>/findr.class.php?refresh=<?= $findr->refreshToken ?>&search="+keyword, 
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
                                        let optionInnerArtist = document.createElement("span");
                                        optionInnerArtist.innerHTML = result.artist;
                                        let image = document.createElement("img");
                                        image.src = result.image;

                                        option.addEventListener("click", () => {
                                            artistInput.value = option.id;
                                            feedback.innerHTML = "You have selected <strong>"+name+"</strong>";
                                        });

                                        optionInner.appendChild(optionInnerArtist);
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