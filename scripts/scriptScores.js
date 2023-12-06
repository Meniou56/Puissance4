// Fonction de chargement des scores JSON
async function chargerScores() {
    const data = await fetch("../data/scores.json")
    const scores = await data.json()
}

// Création du tableau des scores
function creerTableauScores() {

    // On récupère l'emplacement du tableau dans le html
    let tableauBody = document.getElementById("tableauBody")
    
    // On crée une nouvelle ligne
    let tr = document.createElement("tr")

    //Boucle de création des cellules avec leur contenu
    let tdText = ["Nom", 00]
    for(i=0; i<2; i++) {
        td = document.createElement("td")
        td.innerText = tdText[i]
        tr.appendChild(td)
    }

    // On incropore dans le html
    tableauBody.appendChild(tr)
}


//Lancement et appel
//Appel de la fonction de chargement des scores
chargerScores()

//Appel de la fonction de création du tableau
creerTableauScores()
