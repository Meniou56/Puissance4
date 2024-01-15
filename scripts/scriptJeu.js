// 12/12 Bug de validation vide du nom à corriger

/***********************
 * Boucle d'une partie *
 ***********************/

    /*****************
     * Mise en place *
     *****************/

    /* On commence par créer le tableau de jeu JS*/
    let tablJeu = creationTableau()

    /* Définir l'alternance des joueurs en commencant par le rouge */
    let aQuiLeTour = "--couleurJ1"

    /* Définir les variables globales pour compter chaque coup*/
    let coupJ1 = 0
    let coupJ2 = 0
    let coupPlayer = 0

    /* On active la boucle principale */
    let gameOnOff = true

    /**********************
     * Boucle principale  *
     **********************/

    /* Appel de la boucle principale si active*/
    bouclePrincipal()


/*******************
 *Fonction initiale* 
 *******************/

    /* Fonction creation du tableau de jeu */
        function creationTableau() {
            let tablJeu = [
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
            ["", "", "", "", "", "", ""],
        ]

        /* On renvoie le tableau vide */
        return tablJeu

        }


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


/********************
 * Fonctions en jeu *
 ********************/


    /* Fonction de la boucle principale */
        /* Boucle principale (détection des clics sur les cellules) */
        function bouclePrincipal(){

            /*Détection du clic*/
            let mouseClick = document.querySelectorAll("td")

                /* Détection de la cellule cliqué */
                for (let i=0; i<mouseClick.length; i++) {
                    mouseClick[i].addEventListener ("click", (event) => { 
                    let td = event.target.closest("td")

                    /*On recherche le numéro de colonne*/
                    let colIndex = td.cellIndex

                    /* On appel la fonction pour faire glisser le pion, si le jeu est en cours */
                    if(gameOnOff){insererPionColonne(colIndex)}

                })
            }
        }

    /* Fonction pour "glisser" le pion dans la colonne
    * Gère l'insertion d'un pion dans la colonne sélectionnée.
    * La fonction vérifie si la colonne est pleine, trouve la première case vide,
    * met à jour le tableau de jeu et vérifie s'il y a un gagnant.
    */ 

        function insererPionColonne (colonne) {

            /* On défini la couleur du futur pion (futur fonction ça !) */
            let nouvelleCouleur = getComputedStyle(document.documentElement).getPropertyValue(aQuiLeTour)
            
            /*On test toutes les cases de la colonne dans le tableau JS*/
            for (let i=5; i>-2; i--){

                /* On vérifie que la colonne n'est pas déjà rempli */
                if (i===-1) {

                    /* Si c'est le cas, il n'est pas possible de jouer ici */
                    alertMessage("La colonne est déjà pleine")

                    break // sortie si la colonne est pleine

                    /* Sinon on poursuit la recherche de case */
                    } else {

                        /*On test quelle est la prochaine case disponible dans la colonne */
                        if (tablJeu[i][colonne] === "") {

                            /*On change la valeur de la case dans le tableau JS */
                            tablJeu[i][colonne] = nouvelleCouleur

                            /* Puis on rafraichie le tableau de jeu */
                            rafraichirTablJeu([i],[colonne], nouvelleCouleur)

                            /* Et on change de joueur */
                            changePlayer()

                            /* On vérifie s'il y a un gagnant */
                            winnerIs()

                            break// Sortie de la boucle après insertion du pion
                        }
                    
                }
            }
        } 
     


    /**********************************
     * FONCTION DE GESTION DU TABLEAU *
     **********************************/

    /* Fonction de rafrichaissement du tableau de jeu */
    function rafraichirTablJeu(row, col, couleur) {

        /* On vise la ligne puis la colonne puis le cercle */
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

            // On en profite pour compter un coup de plus pour le joueur 2
            coupJ2++
        }
    }


    /***************************************************************
     * FONCTIONS DE DETECTION D'ALIGNEMENT DE JETONS & DE VICTOIRE *
     ***************************************************************/

    /* Fonction de recherche d'un gagnant */
    function winnerIs() {

        /* On check chaque ligne */
        for (let iRow=0; iRow<6; iRow++) {

            /* et chaque colonne de chaque ligne */
            for (let iCol=0; iCol<7; iCol++){

                /* Si la ligne contient un jeton, il faut vérifier ce qui est à côté */
                if(tablJeu[iRow][iCol] !== "") {
                    
                    /* détection de 4 jetons alignés */
                    detectionRow (iRow, iCol)
                    detectionCol (iRow, iCol)
                    detectionDiagonales(iRow, iCol, +1)
                    detectionDiagonales(iRow, iCol, -1)

                }
            }
        }
    }

        /* Fonction de détection des lignes */
        function detectionRow(iRow, iCol){

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
        function detectionCol(iRow, iCol){

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
                            messageVictoire (tablJeu[iRow][iCol])
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
        cancelButton.addEventListener("click", () => {

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
    
    /* Construvtion de la charge utile */
    const newData = {
        "date": date,
        "user": winnerName,
        "coup": coupPlayer //alternance à faire, ainsi que la réinitialisation, etc etc...
    }

    // On récupère le fichier des scores
    scoreSaved(newData)

    // On efface le Popup
    eraseMessage()

    // Puis on redirige vers la page des scores
    window.location.assign("pages/scores.php")

}

// Initialisation fichier score
async function scoreSaved(newData) {

    // Ecriture des nouvelles données
    await fetch("http://localhost:3000/api/scores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify (newData)
    })
}

/**************************
 * FONCTIONS DES MESSAGES *
 **************************/

/* Message en cas de victoire */
function messageVictoire (winnerPopup){

    /* On désactive la possibilité de continuer à jouer */
    gameOnOff = false

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

    /*Après 3 secondes on cache à nouveau la fenetre*/
    setTimeout( ()=> {
        fenetreMessage.style.display = "none"
    }, 2500)
}

/*********************
 * FONCTIONS ANNEXES *
 ******************* */

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

