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

/* Message en cas d'égalité */
async function messageWithButton(messageContent) {

    /*Si en jeu, après X secondes on affiche le message (le temps que le jeton soit tombé)*/
    if(gameOnOff===true){
        gameOnOff = false
        await paused(800)
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

                /*Mise en rechargement de la page en cas de "rejouer"*/
                window.location.href = "index.php"
                }
            )
        } else {
            alertMessage("Erreur : bouton quitter n'ont récupéré", "--couleurMenuAlerte")
        }
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