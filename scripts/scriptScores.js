/************************************
* CHARGEMENT DES SCORES ENREGISTRES *
*************************************/
// Fonction de chargement des scores JSON et de conversion des dates
async function chargerScores() {
    try {
        // Chargement des données
        const response = await fetch('../data/databaseread.php?_ts=' + new Date().getTime())

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`)
        }

        // Transformation en JSON
        let scores = await response.json()

        // Convertis les dates en objets Date pour chaque score
        scores.forEach(score => {
            const parts = score.date.split(' @ ')
            const dateParts = parts[0].split('/')
            const timeParts = parts[1].split(':')
            score.dateObj = new Date(dateParts[2], dateParts[1] - 1, dateParts[0], ...timeParts)
        })

        return scores

    } catch (erreur) {
        console.error('Erreur lors du chargement des données', erreur)
    }
}

// Fonction pour attendre que les scores soient effectivement chargées avant de passer au chargement du tableau
async function initialiserTableau(listeChronoOrdonne) {
    let scores = await chargerScores()

    if (scores) {
        trierEtAfficherScores(scores, listeChronoOrdonne)
    }
}

/***************************
* TRI ET AFFICHAGE TABLEAU *
****************************/

/* Fonction pour trier et afficher les scores selon le critère choisi */
function trierEtAfficherScores(scores, listeChronoOrdonne) {
    if (listeChronoOrdonne) {
        // Tri chronologique
        scores.sort((a, b) => a.dateObj - b.dateObj)
    } else {
        // Tri antéchronologique
        scores.sort((a, b) => b.dateObj - a.dateObj)
    }
    creerTableauScores(scores)
}

/* Fonction de choix du mode de tri */
function choixTriScores() {
    let clickTriScores = document.querySelector("#triScores")
    clickTriScores.addEventListener("click", async () => {
        let scores = await chargerScores()
        if (!scores){return} // Stop si les scores n'est pas chargé

        switch (clickTriScores.value) {
            case "anteChrono":
                listeChronoOrdonne = false
                break
            case "chrono":
                listeChronoOrdonne = true
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
        }

        creerTableauScores(scores)
    })
}

// Fonction création du tableau des scores
function creerTableauScores(scores) {
    let tableauBody = document.getElementById("tableauBody")

    eraseTableauScores() // Effacer le tableau existant avant d'afficher les nouveaux scores

    scores.forEach(score => {
        let tr = document.createElement("tr")
        Object.values(score).forEach(value => {
            let td = document.createElement("td")
            td.innerText = value instanceof Date ? value.toLocaleString() : value
            tr.appendChild(td)
        })
        tableauBody.appendChild(tr)
    })
}

/* Fonction vidage du tableau de scores */
function eraseTableauScores() {
    let tableauScores = document.getElementById("tableauBody")
    while (tableauScores.firstChild) {
        tableauScores.removeChild(tableauScores.firstChild)
    }
}

//LANCEMENT ET APPELS
let listeChronoOrdonne = true // Variable globale pour le sens du tri chronologique

initialiserTableau(listeChronoOrdonne) // Initialiser le tableau au chargement
choixTriScores() // Activer le choix de tri