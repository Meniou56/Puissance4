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
                }
            )
        } else {
            alertMessage("Erreur : bouton rejouer n'ont récupéré", "--couleurMenuAlerte")
        }
    }  

/* Enregistrement du nom via form */
function validerNom(form, validerButton, input) {

    /* Et on le met sur écoute via "entrée" */
    form.addEventListener("submit", (event) => {

        /*On prévient le rafraichissement de la page */
        event.preventDefault()

        /*Si mode online, on revient au jeu*/
        if(modeOnline && coupJ1<3){
            if((input.value).trim()){

                /* On inscrit le nom dans la BDD et on revient au jeu */
                eraseMessage()
                displayIDElement("popup", "none")
                savingOnlineName(input.value)
                startCheckForGame(input.value)

            }else{
                alertMessage("veuillez saisir au moins un caractère", "--couleurMenuAlerte")
            }
        }

        /* On appel la fonction de validation du nom */
        if(!modeOnline || coupJ1>2){
            valideName(input.value)
        }
    })
}

// Fonction qui renvoie le nom au formatage du score */
function valideName(nomJoueur){
    if(nomJoueur.trim()){

        /* On renvoie la valeur de l'input (le nom saisie) */
        scoreFormat(nomJoueur)
    }else{
        alertMessage("veuillez saisir au moins un caractère", "--couleurMenuAlerte")
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
            displayIDElement("popup", "none")

            /*Si Online, retour au menu*/
            if(modeOnline){
                releaseSpaceName()
                window.location.href='index.php'
            }

            /* Puis on reviens au menu précédent */
            messageVictoire()

            }
        )
    } else {
        alertMessage("Erreur : bouton annuler n'a pas été récupéré", "--couleurMenuAlerte")
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

/**************************
 * FONCTIONS DES MESSAGES *
 **************************/

/* Message en cas de victoire */
async function messageVictoire(winnerPopup) {

    /*Si en jeu, après X secondes on affiche le message (le temps que le jeton soit tombé)*/
    if(gameOnOff===true){
        gameOnOff = false
        await paused(800)
    }

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

/* Message en cas de victoire online*/
async function messageVictoireOnline(winnerPopup) {

    /*Si en jeu, après X secondes on affiche le message (le temps que le jeton soit tombé)*/
    if(gameOnOff===true){
        gameOnOff = false
        await paused(800)
    }

    /* Changer le nom de la couleur en français et rechercher le nom du gagnant*/
    let couleurWinner = changeNameOfColor(winnerPopup)
    let userName
    if(couleurWinner==="Rouge"){
        userName=serverSQL.user1
    }else{
        userName=serverSQL.user2
    }

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

    /* Incorporer les nouveaux textes */
    h3Popup.innerText = "Victoire"
    pPopup.innerText = `Bravo ${userName} !`
    replayButton.innerText = "Enregistrer"
    saveButton.innerText = "Quitter"

    /*Afficher le popup*/
    showPopup.style.display = "block"

    /* Appel de la fonction pour savoir si le joueur veux enregistrer son score */
    replayButton.addEventListener('click', () => scoreFormat(userName))

    /* Appel de la fonction pour savoir si le joueur veut quitter */
    saveButton.addEventListener('click', () => leavingGame())

}

/* Message attente partie en ligne */
function waitingOnlineWindow() {

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

    //Remise en forme si nécessaire
    if(replayButton.style.border === "none" || replayButton.style.boxShadow === "none"){
        replayButton.style.border = "3px solid RGBA(185, 159, 108, 0.8)"
        replayButton.style.boxShadow = "5px 5px 20px 1px rgb(125, 125, 125)"
        replayButton.style.backgroundColor = "RGB(205, 179, 128)"
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
    h3Popup.innerText = "Partie en ligne"

    //Nom des joueurs et boutons
    pPopup.innerText = serverSQL.user1 + " VS " + serverSQL.user2
    if(playerRed){
            replayButton.innerText = "Lancer"
    }
    if(playerYellow){
            replayButton.innerText = "En attente"
            replayButton.style.backgroundColor = "orange"
            replayButton.style.border = "none"
            replayButton.style.boxShadow = "none"
    }
    replayButton.disabled = true
    saveButton.innerText = "Quitter"

    /*Afficher le popup*/
    showPopup.style.display = "block"

    /* Bouton de lancement de la partie */
    waitLauningchOnlineGame()

    /* Bouton pour quitter la partie */
    leavingGame()

}

//Fonction de lancement de la partie en ligne
function waitLauningchOnlineGame() {


    /* On écoute le bouton de lancement */
    const buttonReplayClic = document.querySelector("#popup #replay")
        
        /* Le bouton a bien été récupéré ? */
        if (buttonReplayClic) {

            /* S'il y a clic... on appel la fonction de lancement */
            buttonReplayClic.addEventListener("click", () => {

                /*Lancement de la partie*/
                launchingOnlineGame()
                }
            )
        } else {
            alertMessage("Erreur : bouton de lancement n'ont récupéré", "--couleurMenuAlerte")
        }
    }  

/* Message en cas d'égalité */
async function messageWithButton(messageContent) {

    /*Si en jeu, après X secondes on affiche le message (le temps que le jeton soit tombé)*/
    if(typeof gameOnOff !=="undefined"){
            if(gameOnOff===true){
            gameOnOff = false
            await paused(800)
        }
    }

    /* récuperer le popup, le titre et le paragraphe */
    let showPopup = document.getElementById("popup")
    let h3Popup = showPopup.querySelector("h3")
    let replayButton = showPopup.querySelector("#replay")
    let saveButton = showPopup.querySelector("#save")

    /* Chargement des zones de textes et boutons */
    if(!h3Popup){h3Popup = document.createElement("h3")}
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
    showPopup.appendChild(replayButton)
    showPopup.appendChild(saveButton)

    /* Incorporer les nouveaux textes et couleur */
    h3Popup.innerText = messageContent
    replayButton.innerText = "Rejouer"
    saveButton.innerText = "Quitter"

    /*Afficher le popup*/
    showPopup.style.display = "block"

    /* Appel de la fonction pour savoir si les joueurs veulent faire une nouvelle partie */
    playAgain()

    /* Appel de la fonction pour savoir si le joueur veut enregistrer son score */
    leavingGame()

}

/* Fonction de relance d'une partie */
function leavingGame() {


    /* On écoute le bouton rejouer */
    const buttonLeavingClic = document.querySelector("#popup #save")
        
        /* Le bouton a bien été récupéré ? */
        if (buttonLeavingClic) {

            /* S'il y a clic... on appel la fonction de réinitialisation de la partie */
            buttonLeavingClic.addEventListener("click", () => {

                //En mode online, libération de la place
                releaseSpaceName()

                /*Mise en rechargement de la page en cas de "rejouer"*/
                window.location.href = "index.php"
                }
            )
        } else {
            alertMessage("Erreur : bouton quitter n'ont récupéré", "--couleurMenuAlerte")
        }
    }

/* Message-formulaire pour avoir le nom du vainqueur */
function formNomJoueur(messagePopup){

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
    label.innerText = messagePopup+serverSQL.ID
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

    /*Affichage du Popup si nécessaire*/
    let stylePopup = window.getComputedStyle(showPopup)
    if(stylePopup.display === "none"){
            showPopup.style.display = "block"
    }

    /* Action possible */
    annuler(cancelButton)
    validerNom(form, validerButton, input)   
}

/* Message si colonne déjà pleine */
function alertMessage(message, colorVar) {

    /* On récupère le paragraphe du message */
    let alertMessage = document.querySelector("#message p")

    /* On le change avec le message à envoyer */
    alertMessage.innerText = message

    /* Et on l'affiche dans la fenetre */
    let fenetreMessage = document.getElementById("message")
    fenetreMessage.style.display = "block"
    fenetreMessage.style.zIndex = "11"

    // Récupération et application de la couleur de fond
    let rootStyle = getComputedStyle(document.documentElement)
    fenetreMessage.style.backgroundColor = rootStyle.getPropertyValue(colorVar)

    /* Si ce n'est pas un message d'alerte, il se position plus haut*/
    if(colorVar!=="--couleurMenuAlerte"){
        fenetreMessage.style.top = "10rem"
    }else{
        fenetreMessage.style.top = ""
    }

    /*Après X secondes on joue & on cache à nouveau la fenetre*/
    setTimeout( ()=> {
        fenetreMessage.style.display = "none"
    }, 2200)
}


/* Affichage d'un élément ID */
function displayIDElement(element, method) {
    let ElementToDisplay = document.getElementById(element)
    if (ElementToDisplay) {
        ElementToDisplay.style.display = method
    } else {
        console.error("Élément '" + element + "' non trouvé dans le DOM.")
    }
}

//Fonction de countdown et blocage du programme
function countdown(number){
        
        //Récupération de la div et affichage
        let countdown = document.getElementById("countdown")
        countdown.style.display = "block"

        //Itération du compte à rebours
        function updateCountDown(i){
            if(i>0){
                countdown.innerText = i
                countdown.classList.add("animate")

                //Attente fin de transition pour animation inversée
                setTimeout(() => {
                    countdown.classList.remove("animate")
                    setTimeout(() => {
                        updateCountDown(i-1)
                    }, 500)
                }, 500)
            }else{
                //A la fin on cache à nouveau le compteur et promesse accomplie
                countdown.style.display ="none"
            }
        }
        //Attente fin de transition pour continuer compte à rebours
        setTimeout(() => {
            updateCountDown(number)
        }, 500)
}


/**********************************/
/* FONCTIONS SPECIFIQUE AU ONLINE */
/**********************************/

// Fonction de libération d'une place réservé (si un joueur quitte)
async function releaseSpaceName(){
    if(modeOnline && (playerRed || playerYellow) ){
            await savingOnlineName("waiting")
        }
}