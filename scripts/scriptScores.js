// Fonction de chargement des scores JSON
async function chargerScores() {
    const data = await fetch("../data/scores.json")
    const scores = await data.json()
    return scores
}

// Fonction pour attendre que les scores soient effectivement chargées avant de passer au chargement du tableau
async function initialiserTableau() {
    let scores = await chargerScores()
    creerTableauScores(scores)
}

// Création du tableau des scores
function creerTableauScores(scores) {

    // On récupère l'emplacement du tableau dans le html
    let tableauBody = document.getElementById("tableauBody")

    // Boucle de creation des lignes (en fonction du nombre d'entrées dans scores)
    for (iRow=0; iRow<scores.length; iRow++) {

        // creation d'une ligne
        let tr = document.createElement("tr")

        //Création des cellules avec leur contenu

            // On récupère les clés de chaque objet
            const objet = scores[iRow]
            const key = Object.keys(objet)

            // Pour chaque clé on dinque sa valeur dans une cellule
            for(let key in objet) {
                td = document.createElement("td")
                td.innerText = scores[iRow][key]
                tr.appendChild(td)
            }
            
        // On incropore la nouvelle ligne dans le html
        tableauBody.appendChild(tr)

    }

}


//LANCEMENT ET APPELS

//Appel de la fonction d'initialisation du tableau
initialiserTableau()