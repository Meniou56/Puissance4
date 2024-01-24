/************************************
* CHARGEMENT DES SCORES ENREGISTRES *
*************************************/
// Fonction de chargement des scores JSON
async function chargerScores() {
        try {

            // Chargement des données de l'API
            const response = await fetch('../data/databaseread.php?_ts=' + new Date().getTime());

            if(!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`)
            }

            // Transformation en JSON
            const scores = await response.json()
            return scores
    
            // Si erreur :
        } catch (erreur) {
            console.error('Erreur lors du chargement des données', erreur)
        }
}

// Fonction pour attendre que les scores soient effectivement chargées avant de passer au chargement du tableau
async function initialiserTableau(listeChronoOrdonne) {
    let scores = await chargerScores()
    creerTableauScores(scores, listeChronoOrdonne)
}

/***************************
* TRI ET AFFICHAGE TABLEAU *
****************************/

/* Fonction de choix du mode de tri */
function choixTriScores(){

    clickTriScores = document.querySelector("#triScores")
    clickTriScores.addEventListener("click", (event) => {

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

        /* Si ordonné par ordre alphabétique */
        else if(clickTriScores.value==="alphabetique"){
            let triAlphabetiqueInverse = -1
            triScoresUser(triAlphabetiqueInverse)
        }
        else if(clickTriScores.value==="anteAlphabetique"){
            let triAlphabetiqueInverse = 1
            triScoresUser(triAlphabetiqueInverse)
        }

    })
}

/* Fonction de tri des scores par scores (coups) */
async function triScoresCoup(triCoupInverse){
    let scores = await chargerScores()
    if(triCoupInverse){
        scores.sort(function (a, b){return b.coup - a.coup})
    }else{
        scores.sort(function (a, b){return a.coup - b.coup})
    }

    // On réordonne correctement & on crée avec les nouvelles données
    listeChronoOrdonne=true
    creerTableauScores(scores)
}

/* Fonction de tri des scores par nom (user) */
async function triScoresUser(triAlphabetiqueInverse){
    let scores = await chargerScores()

    scores.sort(function (a, b){
        if(a.user.toLowerCase() < b.user.toLowerCase()){return triAlphabetiqueInverse}
        if(a.user.toLowerCase() > b.user.toLowerCase()){return -triAlphabetiqueInverse}
        return 0
    })

    // On réordonne correctement & on crée avec les nouvelles données
    listeChronoOrdonne=true
    creerTableauScores(scores)
}

// Fonction Création du tableau des scores
function creerTableauScores(scores, listeChronoOrdonne) {

    // On récupère l'emplacement du tableau dans le html
    let tableauBody = document.getElementById("tableauBody")

    /*On commence par effacer le tableau */
    eraseTableauScores()

    // Boucle de creation des lignes (en fonction du nombre d'entrées dans scores)
    // On commence par définir le sens de la boucle suivant si ordonné ou non
    if(!listeChronoOrdonne){startBoucle=0}else{startBoucle=scores.length-1}
    if(!listeChronoOrdonne){pasBoucle=+1}else{pasBoucle=-1}
    if(!listeChronoOrdonne){endBoucle=scores.length}else{endBoucle=-1}

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

//LANCEMENT ET APPELS
//Variable globale
let listeChronoOrdonne=true

//Appel de la fonction d'initialisation du tableau
initialiserTableau(listeChronoOrdonne)
choixTriScores()