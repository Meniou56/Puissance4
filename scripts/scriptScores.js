/************************************
* CHARGEMENT DES SCORES ENREGISTRES *
*************************************/

// Fonction de chargement des scores JSON
async function chargerScores() {
    try {

        //Chargement des données
        const response = await fetch('../data/databaseread.php?_ts=' + new Date().getTime())
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`)
        }

        //Conversion JSON
        const scores = await response.json()

        // Renvoie
        return scores

    //Gestion des erreurs
    } catch (erreur) {
        console.error('Erreur lors du chargement des données', erreur)
    }
}

/***************************
* TRI ET AFFICHAGE TABLEAU *
****************************/
// Fonction de conversion des dates pour le tri
function convertirDatePourTri(dateStr) {
    const [datePart, timePart] = dateStr.split(' @ ')
    const [jour, mois, annee] = datePart.split('/')
    const [heure, minutes] = timePart.split(':')
    return `${annee}${mois.padStart(2, '0')}${jour.padStart(2, '0')}${heure}${minutes}`
}

//Fonction de tri et d'affichage des scores
function trierEtAfficherScores(scores, critere) {

    //Choix du mode de tri
    switch (critere) {
        case "chrono":
            scores.sort((a, b) => convertirDatePourTri(b.date).localeCompare(convertirDatePourTri(a.date)))
            break
        case "anteChrono":
            scores.sort((a, b) => convertirDatePourTri(a.date).localeCompare(convertirDatePourTri(b.date)))
            break
        case "highScores":
            scores.sort((a, b) => b.coup - a.coup)
            break
        case "lowScores":
            scores.sort((a, b) => a.coup - b.coup)
            break
        case "alphabetique":
            scores.sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()))
            break
        case "anteAlphabetique":
            scores.sort((a, b) => b.user.toLowerCase().localeCompare(a.user.toLowerCase()))
            break
        case "modeJeu":
        scores.sort((a, b) => a.mode.localeCompare(b.mode, 'fr', { sensitivity: 'base' }))
            break
    }

    //Creation du tableau
    creerTableauScores(scores)
}

//Fonction pour détecter le choix du mode de tri
function choixTriScores() {
    let clickTriScores = document.querySelector("#triScores")
    clickTriScores.addEventListener("change", async () => {
        let scores = await chargerScores()
        if (!scores) return // Si les scores n'ont pas été chargés

        let critere = clickTriScores.value
        trierEtAfficherScores(scores, critere)
    })
}

// Fonction pour créer et afficher le tableau dans le DOM
function creerTableauScores(scores) {
    let tableauBody = document.getElementById("tableauBody")
    eraseTableauScores() // Effacer le tableau existant

    scores.forEach(score => {
        let tr = document.createElement("tr")
        Object.keys(score).forEach(key => {
            let td = document.createElement("td")
            td.innerText = score[key]
            tr.appendChild(td)
        })
        tableauBody.appendChild(tr)
    })
}

//Fonction pour effacer l'affichage
function eraseTableauScores() {
    let tableauScores = document.getElementById("tableauBody")
    while (tableauScores.firstChild) {
        tableauScores.removeChild(tableauScores.firstChild)
    }
}

// LANCEMENT ET APPELS
async function initialiser() {
    let scores = await chargerScores()
    if (scores) {
        trierEtAfficherScores(scores, "chrono") // Tri initial chronologique
        choixTriScores() // Activer le choix de tri
    }
}

//Démarrage
initialiser()