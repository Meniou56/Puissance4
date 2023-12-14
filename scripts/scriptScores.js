// Attention un bug à la maj du tableau !

// Fonction de chargement des scores JSON
async function chargerScores() {
    const data = await fetch("http://localhost:3000/api/scores")
    const scores = await data.json()
    return scores
}

// Fonction pour attendre que les scores soient effectivement chargées avant de passer au chargement du tableau
async function initialiserTableau(listeChronoOrdonne) {
    let scores = await chargerScores()
    creerTableauScores(scores, listeChronoOrdonne)
}

// Fonction Création du tableau des scores
function creerTableauScores(scores, listeChronoOrdonne) {

    // On récupère l'emplacement du tableau dans le html
    let tableauBody = document.getElementById("tableauBody")

    // Boucle de creation des lignes (en fonction du nombre d'entrées dans scores)
    // On commence par définir le sens de la boucle suivant si ordonné ou non
    if(listeChronoOrdonne){startBoucle=0}else{startBoucle=scores.length-1}
    if(listeChronoOrdonne){pasBoucle=+1}else{pasBoucle=-1}
    if(listeChronoOrdonne){endBoucle=scores.length}else{endBoucle=-1}

    for (iRow=startBoucle; iRow!=endBoucle; iRow=iRow+pasBoucle) {

        // creation d'une ligne
        let tr = document.createElement("tr")

        //Création des cellules avec leur contenu

            // On récupère les clés de chaque objet
            const objet = scores[iRow]

            // Pour chaque clé on indique sa valeur dans une cellule
            for(let key in objet) {
                let td = document.createElement("td")
                td.innerText = scores[iRow][key]
                tr.appendChild(td)
            }
            
        // On incropore la nouvelle ligne dans le html
        tableauBody.appendChild(tr)

    }

}

/* Fonction vidage du tableau de scores */
function eraseTableauScores(){

    /* On récupèe le tableau */
    let tableauScores = document.getElementById("tableauBody")

    /* Pour mieux le supprimer */
    if(tableauScores){
        while (tableauScores.firstChild) {
            tableauScores.removeChild(tableauScores.firstChild)
        }
    }
}

/* Fonction de choix du mode de tri */
function choixTriScores(){
    clickTriScores = document.querySelector("#triScores")
    clickTriScores.addEventListener("click", (event) => {

        /*On commence par effacer le tableau */
        eraseTableauScores()

        /* Si ordonné par dates, on regarde dans quel sens et on réinitlialise le tableau */
        if(clickTriScores.value==="anteChrono"){
            listeChronoOrdonne=false
            initialiserTableau(listeChronoOrdonne)
        }else if(clickTriScores.value==="chrono"){
            listeChronoOrdonne=true
            initialiserTableau(listeChronoOrdonne)
        }

        /*Si ordonné par Scores */
        else if(clickTriScores.value==="highScores"){
            let triCoupInverse = true
            triScoresCoup(triCoupInverse)}
        else if(clickTriScores.value==="lowScores"){
            let triCoupInverse = false
            triScoresCoup(triCoupInverse)
        }
    })
}

/* Fonction de tri des scores */
async function triScoresCoup(triCoupInverse){
    let scores = await chargerScores()
    if(triCoupInverse){
        scores.sort(function (a, b){return a.coup - b.coup})
    }else{
        scores.sort(function (a, b){return b.coup - a.coup})
    }

    // On crée avec les nouvelles données
    creerTableauScores(scores)
}

//LANCEMENT ET APPELS
//Variable globale
let listeChronoOrdonne=false

//Appel de la fonction d'initialisation du tableau
initialiserTableau(listeChronoOrdonne)
choixTriScores()