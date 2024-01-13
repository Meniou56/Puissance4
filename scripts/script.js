/* Fonction de chargement du menu : affichage et placement */
function chargementMenu(){
    popup = document.querySelector("#popup")
    popup.style.display = "block"
    popup.style.position = "static"
    popup.style.top = "0"
    popup.style.left = "0"
    popup.style.transform = "translate(0, 0)"
}


/*Fonction de configuration du menu : adressage et désactivation de bouton */
function configurationMenu(){
    document.querySelector("#soloMode").disabled = true
    document.querySelector("#duoMode").onclick = function(){window.location.href = "jeu.php"}
    document.querySelector("#online").disabled = true
    document.querySelector("#configuration").disabled = true
    document.querySelector("#scoresPage").onclick = function(){window.location.href = "pages/scores.php"}
}

/**********************
* LANCEMENT ET APPELS *
***********************/
chargementMenu()
configurationMenu()