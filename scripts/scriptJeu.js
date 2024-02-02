/*****************
 * Mise en place *
 *****************/

/* On commence par créer les tableaux de jeu JS*/
let tablJeu = creationTableau(6, 7, '')

/* Définir l'alternance des joueurs en commencant par le rouge */
let aQuiLeTour = "--couleurJ1"

/* Définir les variables globales pour compter chaque coup*/
let coupJ1 = 0
let coupJ2 = 0
let coupPlayer = 0

// Définir si l'IA joue
let IAplaying = false

/* On active la boucle principale */
let gameOnOff = true

/* Variable globales pour le mode Online*/
let playerRed = false
let playerYellow = false
let serverSQL

/**************
 * Démarrage  *
 **************/

/* Démarrage en fonction des modes */

    /*Initialisation si mode Online*/
    if(modeOnline){
        displayIDElement("TableauVS", "inline")
        initialiseLoadOnline()
    } else {
        startingGame()
    }

    //Lancement et information 1er joueur
    function startingGame(){

        //Rouge commence
        if((modeOnline && playerRed) || modeSolo){
            setTimeout( ()=> {
                alertMessage("Vous commencez", "--couleurMenu")
            }, 900)
            activeClickOver()

        // Jaune commence
        } else if (!modeSolo){
            setTimeout( ()=> {
                alertMessage("Rouge commence", "--couleurMenuRed")
            }, 900)

            //Si on est pas en mode Online, jaune doit pouvoir jouer aussi (playerYellow est défini uniquement en mode online)
            if(!playerYellow){
                activeClickOver()

            //Attendre que rouge ai joué
            } else {
                waitingTurn("yturn")
            }
        }
    }

/*******************************/
/* FONCTIONS POUR LES TABLEAUX */
/*******************************/
    /* Fonction creation du tableau de jeu */
    function creationTableau(totalRow, totalCol, donnes) {
        let tableauCree = []

        for(iRow=0; iRow<totalRow; iRow++){
            let newRow = []

            for(iCol=0; iCol<totalCol; iCol++){
                newRow.push(donnes)
            }
            tableauCree.push(newRow)
        }
        return tableauCree
    }

/* Fonction pour vider un tableau */
    function viderTableau(tableau, newValue) {
        for (let iRow = 0; iRow < tableau.length; iRow++) {
            for (let iCol = 0; iCol < tableau[iRow].length; iCol++) {
                tableau[iRow][iCol] = newValue
            }
        }
    }

/* Fonction qui renvoie le tableau correspond à la couleur de la case */
function whatTableColorIsThisCell(color){
    switch (color) {
        case "red" :
            scoreInteretColonne=scoreInteretColonneRed
            break
        case "yellow" :
            scoreInteretColonne=scoreInteretColonneYellow
            break
    }
    return scoreInteretColonne
}

/***************************************/
/* FONCTIONS DE GESTION SOURIS/CLAVIER */
/***************************************/

/* Activation click/over sur le jeu */
function activeClickOver() {
    // Détection du clic ou survol
let mouseClick = document.querySelectorAll("td")

    // Détection de la cellule
    for (let i = 0; i < mouseClick.length; i++) {

        // activation
        mouseClick[i].addEventListener("mouseover", handleMouseOver)
        mouseClick[i].addEventListener("click", handleMouseClick)
    }
}


/* Désactivation click/over sur le jeu */
function desactiveClickOver() {
    /* On désactive l'écoute d'événement sur le jeu*/
    let mouseClick = document.querySelectorAll("td")

    // Détection de chaque cellule
        for (let i = 0; i < mouseClick.length; i++) {

        // désactivation
            mouseClick[i].removeEventListener("mouseover", handleMouseOver)
            mouseClick[i].removeEventListener("click", handleMouseClick)
         }
    }

    /* Pour chaque flèche*/
    function handleMouseOver(event) {
            // On détermine la colonne
            let colIndex = detectionColonne(event)

            // On affiche la flèche correspondante après avoir supprimé les anciennes
            eraseAllArrow()
            if (gameOnOff) {
                afficherFlecheSelection(colIndex)
            }
    }

    /* Pour les jetons*/
    function handleMouseClick(event) {
        // On appelle la fonction pour déterminer la colonne concernée
        let colIndex = detectionColonne(event)

        // On appelle la fonction pour faire glisser le pion, si le jeu est en cours
        if (gameOnOff) {
            insererPionColonne(colIndex)
        }
    }

/* Fonction pour mettre en pause souris/clavier */
function desactiverSouris(duration) {
    document.addEventListener('click', desactiverClics, true);
    document.addEventListener('keydown', desactiverTouches, true);

    setTimeout(() => {
        document.removeEventListener('click', desactiverClics, true);
        document.removeEventListener('keydown', desactiverTouches, true);
    }, duration);
}

    /*Sous fonction pour la souris*/
    function desactiverClics(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    /*Sous fonction pour le clavier*/
    function desactiverTouches(event) {
        event.stopPropagation();
        event.preventDefault();
    }

    /* Fonction pour "glisser" le pion dans la colonne
    * Gère l'insertion d'un pion dans la colonne sélectionnée.
    * La fonction vérifie si la colonne est pleine, trouve la première case vide,
    * met à jour le tableau de jeu et vérifie s'il y a un gagnant.
    */ 
        async function insererPionColonne (colonne) {

            /*On test toutes les cases de la colonne dans le tableau JS*/
            for (let i=5; i>-2; i--){

                /* On vérifie que la colonne n'est pas déjà rempli */
                if (i===-1) {

                    alertMessage("La colonne est déjà pleine", "--couleurMenuAlerte")//sinon c'est l'humain
                    break // sortie si la colonne est pleine

                    /* Sinon on poursuit la recherche de case */
                    } else {

                        /*On test quelle est la prochaine case disponible dans la colonne */
                        if (tablJeu[i][colonne] === "") {

                            /* On défini la couleur du futur pion*/
                            let nouvelleCouleur = getCouleurJoueurActuel()
                            tablJeu[i][colonne] = nouvelleCouleur

                            /* Puis on rafraichie le tableau de jeu */
                            rafraichirTablJeu(i,colonne, nouvelleCouleur)

                            /* Et on change de joueur */
                            changePlayer()

                            /* On vérifie si c'est la fin du jeu */
                            isTableFull()
                            detectionAlignement()

                            // Or if it's to online player
                            if(playerRed || playerYellow){
                                await updateGame(i, colonne, nouvelleCouleur)
                                desactiveClickOver()
                                console.log("Je ne peux plus jouer")
                                if(playerRed){
                                    console.log("fin de tour rouge")
                                    waitingTurn("rturn")
                                }else if(playerYellow){
                                    console.log("fin de tour jaune")
                                    waitingTurn("yturn")
                                }else{
                                    console.log("problème dans la boucle de détection des tours online")
                                }
                          
                            /* Check if it's to computer to play */
                            } else if(gameOnOff){
                                isComputerTurn(nouvelleCouleur)
                            }

                            /*Sinon sortie de boucle*/
                            break
                        }
                }
            }
        } 

    /***************************************************************
     * FONCTIONS DE DETECTION D'ALIGNEMENT DE JETONS & DE VICTOIRE *
     ***************************************************************/

/* Fonction de recherche d'un gagnant */
function detectionAlignement() {

    /* On check chaque ligne */
    for (let iRow=0; iRow<6; iRow++) {

        /* et chaque colonne de chaque ligne */
        for (let iCol=0; iCol<7; iCol++){

            /* Si la ligne contient un jeton, il faut vérifier ce qui est à côté */
            if(tablJeu[iRow][iCol] !== "") {
                
                /* détection de 4 jetons alignés */
                detectionRowPlayed (iRow, iCol)
                detectionColPlayed (iRow, iCol)
                detectionDiagonales(iRow, iCol, +1)
                detectionDiagonales(iRow, iCol, -1)

            }
        }
    }
}

    /* Fonction de détection des lignes */
    function detectionRowPlayed(iRow, iCol){

        let compteurJetonWinner = 1
        let nextCellRow = iRow

        /* On vérifie les 4 cases adjacentes en ligne si elles ne sont pas en dehors du tableau*/
        for(let nextCellCol=iCol+1; nextCellCol<iCol+4 && nextCellCol<7; nextCellCol++){

                /* Et on lance la fonction pour savoir s'il sont identiques... */
                    if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonWinner)){
                        compteurJetonWinner++
                    } else {
                        break // la série de jetons identiques est interrompu 
                    }
            }
    }



    /* Fonction de détection des colonnes */
    function detectionColPlayed(iRow, iCol){

        let compteurJetonWinner = 1
        let nextCellCol = iCol

        /* On vérifie les 4 cases adjacentes en colonne, si elles ne sont pas en dehors du tableau */
        for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6; nextCellRow++){

                /* Et on lance la fonction pour savoir s'il sont identiques... */
                if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonWinner)){
                    compteurJetonWinner++
                } else {
                    break // la série de jetons identiques est interrompu 
                }
            }
    }



    /* Fonction de détection des diagonales */
    function detectionDiagonales(iRow, iCol, increment){

        let compteurJetonWinner = 1
        let nextCellCol = iCol

        /* On vérifie les 4 cases adjacentes en colonne, si elles ne sont pas en dehors du tableau */
        for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6; nextCellRow++){

            /* On augmente également la ligne de 1 pour créer la diagonale */
                nextCellCol=nextCellCol+increment

                /* On execute le code uniquement si cette case ne sort pas du tableau */
                if(nextCellCol<7){

                    /* Et on lance la fonction pour savoir s'il sont identiques... */
                    if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonWinner)){
                        compteurJetonWinner++
                    } else {

                        break // la série de jetons identiques est interrompu 
                    }
                } else {

                    break // On est sorti du tableau
            }

        }
    }
    

        /*Fonctions en cas de jetons identiques, on le note, on regarde si c'est arrivé 4 fois et si oui on affiche le message de victoire */
        function verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonWinner) {

            /* Si c'est bien une case du tableau, on regarde son contenu */
            if (tablJeu[iRow][iCol] === tablJeu[nextCellRow][nextCellCol]){
                compteurJetonWinner++

                    /* Est-on arrivé à 4 jetons d'affilés ? */
                    if (compteurJetonWinner === 4){

                        /* On enregistre le nomre de coup du vainqueur */
                        coupPlayer = nbCoupWinner(tablJeu[iRow][iCol])

                        /* On a un winner, on lui envoie un message */
                        if(modeSolo && aQuiLeTour === "--couleurJ1"){
                            messageWithButton("Perdu !")
                        }else{
                            messageVictoire (tablJeu[iRow][iCol])
                        }
                    }

                    return true //Il y a bien un jeton supplémentaire identique
                }

                return false //Le jeton n'est pas identique
            }

        /*Fonction pour déterminer s'il y a egalité*/
        function isTableFull(){

            // Initialisation compteur de colonne pleine
            let fullCol=0

            // Parcourir chaque colonne
            for (let iCol = 0; iCol <= tablJeu.length; iCol++) {
                
                //Regarder pour chaque colonne si la dernière cellule est pleine
                if(tablJeu[0][iCol]!==""){fullCol++}
                if(fullCol===6){
                    messageWithButton("Égalité !")
                }
            }
        }

    /*****************************************
     * FONCTION DE GESTION DU TABLEAU VISUEL *
     *****************************************/

    /* Fonction de rafrichaissement du tableau de jeu */
    function rafraichirTablJeu(row, col, couleur) {

        /* On vise la ligne puis la colonne puis le cercle et enfin la div */
        let targetRow = document.querySelectorAll("tr")[row]
        let cell = targetRow.querySelectorAll("td")[col]
        let pion = cell.querySelector(".circle")
        let carreCell = cell.querySelector("div")

        /* Création d'un nouveau pion pour un arriere plan cohérent*/
        let newPion = document.createElement("div")
        newPion.classList.add("circle")
        newPion.classList.add("circle-filled")
        carreCell.appendChild(newPion)

        /* Et on change la couleur */
        pion.style.backgroundColor = couleur
        pion.style.boxShadow = "none"
        pion.classList.add("circle-animate")

        /* On désactice l'utilisation de la souris, donc du jeu */
        desactiverSouris(750)

    }

    /**********************************
     * FONCTION DE GESTION DES JOUEURS *
     **********************************/

    /* Fonction d'alternance des joueurs */
    function changePlayer() {
        console.log("changement de joueur")
        if (aQuiLeTour === "--couleurJ1"){
            aQuiLeTour = "--couleurJ2"

            // On en profite pour compter un coup de plus pour le joueur 1 et indiquer le prochain joueur
            coupJ1++
            if(!modeSolo){
                if(coupJ1<4){
                    setTimeout( ()=> {
                        alertMessage("Tour de jaune", "--couleurMenuYellow")
                    }, 750)
                }
            }

        } else {
            aQuiLeTour = "--couleurJ1"
            if(IAplaying){
                IAplaying=false
            }

            // On en profite pour compter un coup de plus pour le joueur 2
            coupJ2++
            if(!modeSolo){
                if(coupJ2<3){
                    setTimeout( ()=> {
                        alertMessage("Tour de rouge", "--couleurMenuRed")
                    }, 750)
                }
                if(coupJ2===3){
                    setTimeout( ()=> {
                        alertMessage("Jouez selon la couleur des flèches maintenant ;)", "--couleurMenu")
                    }, 750)
                }
            }else{
                if(coupJ2<4){
                    setTimeout( ()=> {
                        alertMessage("C'est votre tour", "--couleurMenu")
                    }, 750)
                }
                if(coupJ2===4){
                    setTimeout( ()=> {
                        alertMessage("Je vous laisse jouer maintenant ;)", "--couleurMenu")
                    }, 750)
                }
            }
        }
    }

    /* Retourne la couleur du joueur actuel */
    function getCouleurJoueurActuel() {
        return getComputedStyle(document.documentElement).getPropertyValue(aQuiLeTour);
    }
    
/*************************************
 * FONCTIONS ENREGISTREMENT DE SCORE *
 *************************************/

/* Fonction d'enregistrement du score */
function saveScore() {

    /* On écoute le bouton enregistrer */
    const buttonSaveClic = document.querySelector("#popup #save")

        /* Le bouton a bien été récupéré ? */
        if (buttonSaveClic) {

            /* S'il y a clic... on appel la fonction d'enregistrement du nom */
            buttonSaveClic.onclick = () => {formNomJoueur("Entrer le nom du vainqueur")}
        } else {
            alertMessage("Erreur : Bouton sauvegarder n'ont récupéré", "--couleurMenuAlerte")
        }
    } 
    

/* Fonction de mise en forme nom et score */
function scoreFormat(winnerName) {
    
    // On récupère la date
    const actualTime = new Date()
    const date = `${String(actualTime.getDate()).padStart(2, '0')}/${String(actualTime.getMonth() +1).padStart(2, '0')}/${String(actualTime.getFullYear()).padStart(2, '0')} @ ${String(actualTime.getHours()).padStart(2, '0')}:${String(actualTime.getMinutes()).padStart(2, '0')}`
    
    /* Construction de la charge utile */
    const newData = {
        "date": date,
        "user": winnerName,
        "coup": coupPlayer //alternance à faire, ainsi que la réinitialisation, etc etc...
    }

    // On récupère le fichier des scores et on écrit dedans
    scoreSaved(newData)

    // On efface le Popup
    eraseMessage()
    displayIDElement("popup", "none")
}

// Envoie fichier score
async function scoreSaved(newData) {

    try {
        // Ecriture des nouvelles données
        const reponse = await fetch('./data/databasewrite.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
        })

        // Vérification
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`)
        }

        // Puis on redirige vers la page des scores
        window.location.assign("pages/scores.php")

    } catch (erreur) {
        console.error('Erreur lors de l\'envoie des données', erreur)
    }
}

/*********************
 * FONCTIONS ANNEXES *
 ******************* */
/* Fonction de génération aléatoire */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

/* Fonction de chrono */
function paused(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

/* Fonction de traduction des couleurs en français */
function changeNameOfColor(winnerPopup){
    couleurWinner=winnerPopup

if(winnerPopup === "red"){
    return "Rouge"
} else {
    return "Jaune"
}
}

/* Fonction pour connaitre le nombre de coup du vainqueur */
  function nbCoupWinner(winnerColor) {

    // On check à quel joueur c'était le tour
    if (winnerColor==="yellow"){

        // Le J2 étant deuxième, s'il y a égalité du nombre de coup, c'est le J2 qui a gagné
        coupPlayer=coupJ2

        // Inversement, J1>J2, c'est donc le J1 qui a gagné
    }else if(winnerColor==="red"){
        coupPlayer=coupJ1
    }else{
        coupPlayer="le vainqueur n'a pas été déterminé"
    }
    return coupPlayer
  } 

  /***********************************
  /* FONCTION CONCERNANT LE FLECHAGE */
  /***********************************/
    /* Fonction de fléchage des colonnes visées */
    function afficherFlecheSelection(colIndex){

        /*On récupère la couleur*/
        let couleurJoueur = getCouleurJoueurActuel()

        /*On récupère la flèche */
        let targetRow = document.querySelectorAll("tr")[0]
        let cell = targetRow.querySelectorAll("td")[colIndex]
        let fleche = cell.querySelector(".flecheSelection")
        fleche.style.color = couleurJoueur
        fleche.style.display = "block"
        flecheAffiche = true

        /* Après X ms on cache la flèche */
        setTimeout( ()=> {
            fleche.style.display = "none"
            flecheAffiche = false
        }, 1500)
    }

    /*Fonction pour faire disparaitre les flèches*/
    function eraseAllArrow() {

        /*On récupère chaque flèche et son état*/
        for(i=0; i<7; i++){
            const targetRow = document.querySelectorAll("tr")[0]
            let cell = targetRow.querySelectorAll("td")[i]
            const arrow = cell.querySelector(".flecheSelection")
            const style = window.getComputedStyle(arrow)

            /* S'il est affiché, on le passe en display none*/
            if(style.getPropertyValue("display")!== "none") {
                arrow.style.display = "none"
            }
        }
    }

    // Fonction de détection de colonne ou survient un événement */
    function detectionColonne(event) {

        let td = event.target.closest("td")
        return td.cellIndex
    }