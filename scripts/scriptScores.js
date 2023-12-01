// Fonction de chargement des scores JSON
async function chargerScores() {
    const data = await fetch("../data/scores.json")
    const scores = await data.json()
}

// Création du tableau des scores
function creerTableauScores() {
    let tableauBody = document.getElementId("tableauBody")
    console.log(tableauBody)
    //let tableau = document.createElement("tr>td")
    //reste de la création de tableau

    //document.body.appendChild(tbody)
}


//Lancement et appel
//Appel de la fonction de chargement des scores
chargerScores()

//Appel de la fonction de création du tableau
creerTableauScores()
