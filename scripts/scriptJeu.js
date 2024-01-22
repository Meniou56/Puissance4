/***********************
 * Boucle d'une partie *
 ***********************/

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

    // Définir si mode solo actif, si l'IA joue et le score d'intérêt de chaque colonne
    let modeSolo = true
    let scoreInteretColonneRed = creationTableau(6, 7, 0)
    let scoreInteretColonneYellow = creationTableau(6 ,7, 0)
    let IAplaying = false

    /* On active la boucle principale */
    let gameOnOff = true

    /**********************
     * Démarrage  *
     **********************/

    /* Appel des écoutes pour pouvoir jouer */
    activeClickOver()

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

/*******************
 *Fonction initiale* 
 *******************/

    /* Fonction de réinitalisation de la partie */
        function reinitiateGame(){

            /* On vide le tableau JS */
            tablJeu = creationTableau()

            /* On remet le J1 en 1er */
            aQuiLeTour = "--couleurJ1"

            /* Réinitialiser les variables pour compter chaque coup */
            coupJ1 = 0
            coupJ2 = 0
            coupPlayer = 0

            /* On mets à jour l'affichage */
            for (let iRow=0; iRow<6; iRow++) {
                for(let iCol=0; iCol<7; iCol++){
                    rafraichirTablJeu(iRow,iCol, "")
                }
            }

            /*On reautorise à jouer */
            gameOnOff=true

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
            console.log("l'humain joue colonne :", colIndex+1, "coup :", coupJ1)
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
        function insererPionColonne (colonne) {

            /*On test toutes les cases de la colonne dans le tableau JS*/
            for (let i=5; i>-2; i--){

                /* On vérifie que la colonne n'est pas déjà rempli */
                if (i===-1) {

                    alertMessage("La colonne est déjà pleine")//sinon c'est l'humain
                    break // sortie si la colonne est pleine

                    /* Sinon on poursuit la recherche de case */
                    } else {

                        /*On test quelle est la prochaine case disponible dans la colonne */
                        if (tablJeu[i][colonne] === "") {

                            /* On défini la couleur du futur pion*/
                            let nouvelleCouleur = getCouleurJoueurActuel()
                            tablJeu[i][colonne] = nouvelleCouleur

                            /* Puis on rafraichie le tableau de jeu */
                            rafraichirTablJeu([i],[colonne], nouvelleCouleur)

                            /* Et on change de joueur */
                            changePlayer()

                            /* On vérifie s'il y a un gagnant */
                            detectionAlignement()

                            /* Check if it's to computer to play */
                            if(gameOnOff){
                                isComputerTurn(nouvelleCouleur)
                            }
                            /*Sinon sortie de boucle*/
                            break
                        }
                }
            }
        } 

    /****************/
    /* FONCTIONS IA */
    /****************/

    /*Fonction pour déterminer si c'est à l'IA de jouer */
    function isComputerTurn(couleurDernierJoueur) {
        if(modeSolo && couleurDernierJoueur === "red"){
            IAplaying = true

            console.log("le tableau de jeu détecté resemble à :", tablJeu)

            startComputerPlaying()
        } 
    }
    

    /* Fonction principal d'activation/désactivation de l'IA*/
    async function startComputerPlaying() {

        /* On désactive les possibilités d'action du joueur humain*/
        desactiveClickOver()

        /*On déterminer si l'IA à inséré un pion*/
        await IAInsertPion()

        /*On relance le jeu pour l'humain*/
        IAplaying = false
        activeClickOver()

    }

    /*Fonction pour que l'IA insere un pion*/
    async function IAInsertPion(){

            /*Temps de reflexion de l'IA ^^*/
            await paused(500)

            /*On réinitialise le score d'intérêt de la chaque cellule pour en établir un nouveau*/
            //console.log("0.avant vidage tableau", scoreInteretColonne)
            viderTableau(scoreInteretColonneRed, 0)
            viderTableau(scoreInteretColonneYellow, 0)

        //console.log("1.réinitilisation : ", scoreInteretColonne)
        detectionAlignement()
    }

    /* Fonction ou l'IA détermine si elle a fait un bon choix */
    function IAChoice() {
        console.log("le tableau rouge vaut : ", scoreInteretColonneRed)
        console.log("le tableau jaune vaut : ", scoreInteretColonneYellow)

        let colonneAChoisir = []

        // Parcourir chaque colonne
        for (let iCol = 0; iCol <= tablJeu.length ; iCol++) {
            colonneAChoisir[iCol] = -1 // Initialiser avec -1 pour indiquer aucune colonne pleine trouvée
        
            // Parcourir chaque ligne depuis le bas pour cette colonne
            for (let iRow=5; iRow>-1; iRow--){ {
                if (tablJeu[iRow][iCol] === "") {

                    // Enregistrer le meilleur indice de la ligne vide
                    if(scoreInteretColonneYellow[iRow][iCol]>=scoreInteretColonneRed[iRow][iCol]){
                        newIndice = scoreInteretColonneYellow[iRow][iCol]
                    } else {
                        newIndice = scoreInteretColonneRed[iRow][iCol]
                    }
                    colonneAChoisir[iCol] = newIndice
                    break // Arrêter la recherche dès qu'une ligne vide est trouvée
                }
            }
        }
    }

        /* On ajoute un peu de hasard*/
        /*for(i=0; i<7; i++){
            colonneAChoisir[i] = colonneAChoisir[i]+getRandomInt(0, 2)
        }*/

        console.log("3.Tableau final: ", colonneAChoisir)

        /*On compare les valeurs du tableau pour décider ou doit aller le pion*/
        let colonne = 0
        let valeurMAxCol = colonneAChoisir[0]

        for (let i = 0; i<7; i++){
            if (colonneAChoisir[i] > valeurMAxCol) {
                valeurMAxCol = colonneAChoisir[i]
                colonne = i
            }
        }
        console.log("La colonne choisi est donc : ", colonne)

        /*On test toutes les cases de la colonne dans le tableau JS*/
        for (let iRow=5; iRow>-2; iRow--){

                if (tablJeu[iRow][colonne] === "") {

                    tablJeu[iRow][colonne] = "yellow"

                    /* Si elle est dispo, c'est la case gagnante */
                    rafraichirTablJeu(iRow, colonne, "yellow")

                    /* Et on change de joueur */
                    changePlayer()

                    /* On vérifie s'il y a un gagnant */
                    detectionAlignement()

                    break
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
        desactiverSouris(500)

    }

    /**********************************
     * FONCTION DE GESTION DES JOUEURS *
     **********************************/

    /* Fonction d'alternance des joueurs */
    function changePlayer() {
        if (aQuiLeTour === "--couleurJ1"){
            aQuiLeTour = "--couleurJ2"

            // On en profite pour compter un coup de plus pour le joueur 1
            coupJ1++

        } else {
            aQuiLeTour = "--couleurJ1"
            if(IAplaying){IAplaying=false}

            // On en profite pour compter un coup de plus pour le joueur 2
            coupJ2++
        }
    }

    /* Retourne la couleur du joueur actuel */
    function getCouleurJoueurActuel() {
        return getComputedStyle(document.documentElement).getPropertyValue(aQuiLeTour);
    }

    /***************************************************************
     * FONCTIONS DE DETECTION D'ALIGNEMENT DE JETONS & DE VICTOIRE *
     ***************************************************************/

    /* Fonction de recherche d'alignement */
    function detectionAlignement() {

        /* On check chaque ligne */
        for (let iRow=0; iRow<tablJeu.length; iRow++) {

            /* et chaque colonne de chaque ligne */
            for (let iCol=0; iCol<tablJeu[iRow].length; iCol++){

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
        if(IAplaying){
            IAChoice()
        }
    }

        /* Fonction de détection des lignes */
        function detectionRowPlayed(iRow, iCol){

            let compteurJetonsAlignes = 1
            let nextCellRow = iRow

            /* On vérifie les 4 cases adjacentes en ligne si elles ne sont pas en dehors du tableau*/
            for(let nextCellCol=iCol+1; nextCellCol<iCol+4 && nextCellCol<7; nextCellCol++){

                    /* Et on lance la fonction pour savoir s'il sont identiques... */
                        if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonsAlignes, "horizontal")){
                            compteurJetonsAlignes++
                        }
                }
        }



        /* Fonction de détection des colonnes */
        function detectionColPlayed(iRow, iCol){

            let compteurJetonsAlignes = 1
            let nextCellCol = iCol

            /* On vérifie les 4 cases adjacentes en colonne, si elles ne sont pas en dehors du tableau */
            for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6; nextCellRow++){


                    /* Et on lance la fonction pour savoir s'il sont identiques... */
                    if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonsAlignes, "vertical")){
                        compteurJetonsAlignes++
                    } else {

                        //la série de jetons identiques est interrompu
                        // On informe l'IA du potentiel de la case supérieure et on quite la boucle
                        if(IAplaying){
                            scoreInteretColonne[nextCellRow-1][nextCellCol] += compteurJetonsAlignes
                            console.log("case : ", nextCellRow-1, nextCellCol, " est intéressante")}
                        break
                    }
                }
        }



        /* Fonction de détection des diagonales */
        function detectionDiagonales(iRow, iCol, increment){

            let compteurJetonsAlignes = 1
            let nextCellCol = iCol
            let direction = 0

            switch (increment){
                case -1 :
                direction="diagonalUp"
                break
                case 1 :
                direction="diagonalDown"
                break
            }

            /* On vérifie les 4 cases adjacentes en colonne, si elles ne sont pas en dehors du tableau */
            for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6; nextCellRow++){

                /* On augmente également la ligne de 1 pour créer la diagonale */
                    nextCellCol=nextCellCol+increment

                    /* On execute le code uniquement si cette case ne sort pas du tableau */
                    if(nextCellCol<7){

                        /* Et on lance la fonction pour savoir s'il sont identiques... */
                        if(verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonsAlignes, direction)){
                            compteurJetonsAlignes++
                        } else {
                            break // la série de jetons identiques est interrompu 
                        }
                    } else {

                    break // On est sorti du tableau
                }

            }
            }
        

            /*Fonctions en cas de jetons identiques, on le note, on regarde si c'est arrivé 4 fois et si oui on affiche le message de victoire */
            function verifierAlignement(iRow, iCol, nextCellRow, nextCellCol, compteurJetonsAlignes, alignementType) {

                /*On note, pour l'IA, le nombre de jetons alignés et donc l'intérêt de cette case et de celle avant le début de ligne*/
                if(IAplaying){
                    
                    /*Ajustement cellule précédente*/
                    let prevCellRow, prevCellCol
                    switch (alignementType) {
                        case "horizontal":
                            prevCellRow=iRow
                            prevCellCol=iCol-1
                            break
                        case "vertical":
                            prevCellRow=iRow-1
                            prevCellCol=iCol
                            break
                        case "diagonalUp":
                            prevCellRow=iRow-1
                            prevCellCol=iCol-1
                            break
                        case "diagonalDown":
                            prevCellRow=iRow-1
                            prevCellCol=iCol+1
                            break
                    }

                    /* A quelle couleur va le nouveau score ? */
                    let scoreInteretColonne = whatTableColorIsThisCell(tablJeu[iRow][iCol])

                    /* Si la nouvelle valeur des cases adjacentes est supérieure à la précédente, on change le score */
                        scoreInteretColonne[nextCellRow][nextCellCol]+=compteurJetonsAlignes
                        if(compteurJetonsAlignes===2){scoreInteretColonne[nextCellRow][nextCellCol]+2}
                        if(compteurJetonsAlignes===3){scoreInteretColonne[nextCellRow][nextCellCol]+4}

                    if(prevCellRow>-1 && prevCellCol >-1 && prevCellCol<6){
                        scoreInteretColonne[prevCellRow][prevCellCol]+=compteurJetonsAlignes  
                        if(compteurJetonsAlignes===2){scoreInteretColonne[prevCellRow][prevCellCol]+2}
                        if(compteurJetonsAlignes===3){scoreInteretColonne[prevCellRow][prevCellCol]+4}
                    }
                }

                /* Si c'est bien une case du tableau, on regarde son contenu */
                if (tablJeu[iRow][iCol] === tablJeu[nextCellRow][nextCellCol]){
                    compteurJetonsAlignes++

                        /* Est-on arrivé à 4 jetons d'affilés ? */
                        if (compteurJetonsAlignes === 4){

                            /* On enregistre le nombre de coup du vainqueur et le félicite */
                            if(gameOnOff){coupPlayer = nbCoupWinner(tablJeu[iRow][iCol])}
                            if(gameOnOff){messageVictoire (tablJeu[iRow][iCol])}
                        }

                        return true //Il y a bien un jeton supplémentaire identique

                    }

                    return false //Le jeton n'est pas identique
                }

/*********************************
 * Fonctionnement dans les menus *
 *********************************/

/* Fonction de relance d'une partie */
function playAgain() {


    /* On écoute le bouton rejouer */
    const buttonReplayClic = document.querySelector("#popup #replay")
        
        /* Le bouton a bien été récupéré ? */
        if (buttonReplayClic) {

            /* S'il y a clic... on appel la fonction de réinitialisation de la partie */
            buttonReplayClic.addEventListener("click", () => {

                /*Mise en rechargement de la page en cas de "rejouer"*/
                location.reload()

                /* on appel la fonction de réinitialisation de la partie */
                /*reinitiateGame()*/

                /* On réinitialise le menu */
                /*eraseMessage()*/

                /* Puis on cache la fenetre */
                /*hidePopup()*/
                }
            )
        } else {
            alertMessage("Erreur : bouton rejouer n'ont récupéré")
        }
    }  

/* Enregistrement du nom via form */
function validerNom(form, validerButton, input) {

    /* Et on le met sur écoute via "entrée" */
    form.addEventListener("submit", (event) => {

        /*On prévient le rafraichissement de la page */
        event.preventDefault()

        /* On appel la fonction de validation du nom */
        valideName(input.value)
    })
}

// Fonction qui renvoie le nom au formatage du score */
function valideName(nomJoueur){
    if(nomJoueur.trim()){

        /* On renvoie la valeur de l'input (le nom saisie) */
        scoreFormat(nomJoueur)
    }else{
        alertMessage("veuillez saisir au moins un caractère")
    }
}
        


    
/* Bouton annuler */
function annuler(cancelButton) {
        
    /* Le bouton a bien été récupéré ? */
    if (cancelButton) {

        /* S'il y a clic... on annule */
        cancelButton.addEventListener("click", (event) => {

            /*On prévient le rafraichissement de la page */
            event.preventDefault()

            /* on efface le message */
            eraseMessage()

            /* Puis on reviens au menu précédent */
            messageVictoire()
            }
        )
    } else {
        alertMessage("Erreur : bouton annuler n'a pas été récupéré")
    }
}

/* Fonction d'effacement du contenu des messages */
function eraseMessage(){

    /* On récupèe showPopup */
    let showPopup = document.getElementById("popup")

    /* Pour mieux le supprimer */
    if(showPopup){
        while (showPopup.firstChild) {
            showPopup.removeChild(showPopup.firstChild)
        }
    }
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
            buttonSaveClic.onclick = () => {formNomJoueur()}
        } else {
            alertMessage("Erreur : Bouton sauvegarder n'ont récupéré")
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
}

// Initialisation fichier score
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

/************************/
/* FONCTIONS AFFICHAGES */
/************************/


/**************************
 * FONCTIONS DES MESSAGES *
 **************************/

/* Message en cas de victoire */
async function messageVictoire (winnerPopup){

    /*Si en jeu, après X secondes on affiche le message (le temps que le jeton soit tombé)*/
    if(gameOnOff===true){
        gameOnOff = false
        await paused(800)
    }

    /* On désactive la possibilité de continuer à jouer */
    console.log("Victoire")

    /* Changer le nom de la couleur en français */
    let couleurWinner = changeNameOfColor(winnerPopup)

    /* récuperer le popup, le titre et le paragraphe */
    let showPopup = document.getElementById("popup")
    let h3Popup = showPopup.querySelector("h3")
    let pPopup = showPopup.querySelector("p")
    let replayButton = showPopup.querySelector("#replay")
    let saveButton = showPopup.querySelector("#save")

    /* Chargement des zones de textes et boutons */
    if(!h3Popup){h3Popup = document.createElement("h3")}
    if(!pPopup){pPopup = document.createElement("p")}
    if(!replayButton){
        replayButton = document.createElement("button")
        replayButton.id = "replay"
    }
    if(!saveButton){
        saveButton = document.createElement("button")
        saveButton.id = "save"
    }

    /* Raccordement au DOM */
    showPopup.appendChild(h3Popup)
    showPopup.appendChild(pPopup)
    showPopup.appendChild(replayButton)
    showPopup.appendChild(saveButton)

    /* Incorporer les nouveaux textes et couleur */
    h3Popup.innerText = "Victoire"
    pPopup.innerText = `${couleurWinner} a aligné 4 jetons`
    replayButton.innerText = "Rejouer"
    saveButton.innerText = "Enregistrer"

    /*Afficher le popup*/
    showPopup.style.display = "block"

    /* Appel de la fonction pour savoir si les joueurs veulent faire une nouvelle partie */
    playAgain()

    /* Appel de la fonction pour savoir si le joueur veut enregistrer son score */
    saveScore()

}

/* Message-formulaire pour avoir le nom du vainqueur */
function formNomJoueur(){

    /* On efface tout */
    eraseMessage()

    /* récuperer le popup, le titre, le paragraphe et les boutons */
    let showPopup = document.getElementById("popup")
    let validerButton = showPopup.querySelector("#validerButton")
    let cancelButton = showPopup.querySelector("#cancelButton")

    /* Chargement des boutons */
    if(!validerButton){
        validerButton = document.createElement("button")
        validerButton.id = "valider"
        validerButton.type ="submit"
        validerButton.innerText = "Valider"
    }


    if(!cancelButton){
        cancelButton = document.createElement("button")
        cancelButton.id = "cancel"
        cancelButton.innerText = "Annuler"
    }

    /* Création du formulaire */
    let form = document.createElement("form")
    let label = document.createElement("label")
    let br = document.createElement("br")
    let input = document.createElement("input")

    /* On ajoute les textes et attribut de ces nouveaux éléments */
    label.innerText = "Entrer le nom du vainqueur"
    input.name = "name"
    input.minLength = "1"
    input.maxLength = "20"

    /* Raccordement au DOM */
    form.appendChild(label)
    form.appendChild(br)
    form.appendChild(input)
    form.appendChild(validerButton)
    form.appendChild(cancelButton)
    showPopup.appendChild(form)

    /* Action possible */
    annuler(cancelButton)
    validerNom(form, validerButton, input)   
}

/* cacher le message de victoire */
function hidePopup() {

    /* On récupère le popup */
    let hidePopup = document.getElementById("popup")

    /* Si on la bien récupéré, on appel la fonction pour le cacher */
    if (hidePopup){
        hidePopup.style.display = "none"
    }
} 

/* Message si colonne déjà pleine */
function alertMessage(message) {

    /* On récupère le paragraphe du message */
    let alertMessage = document.querySelector("#message p")

    /* On le change avec le message à envoyer */
    alertMessage.innerText = message

    /* Et on l'affiche dans la fenetre */
    let fenetreMessage = document.getElementById("message")
    fenetreMessage.style.display = "block"
    fenetreMessage.style.zIndex = "11"

    /*Après X secondes on cache à nouveau la fenetre*/
    setTimeout( ()=> {
        fenetreMessage.style.display = "none"
    }, 2500)
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