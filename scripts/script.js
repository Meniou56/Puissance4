/* Chargement du menu */
popup = document.querySelector("#popup")
popup.style.display = "block"
popup.style.position = "static"
popup.style.top = "0"
popup.style.left = "0"
popup.style.transform = "translate(0, 0)"

/*Configuration du menu*/
document.querySelector("#soloMode").disabled = true
document.querySelector("#duoMode").onclick = function(){window.location.href = "jeu.html"}
document.querySelector("#online").disabled = true
document.querySelector("#configuration").disabled = true
document.querySelector("#scoresPage").onclick = function(){window.location.href = "scores.html"}