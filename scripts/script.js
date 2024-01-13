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
            let mouseClick = document.querySelectorAll(".circle")

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

        /* Et on change la couleur */
        pion.style.backgroundColor = couleur
        pion.classList.add("circle-filled")
    }

    /**********************************
     * FONCTION DE GESTION DES JOUEURS *
     **********************************/

    /* Fonction d'alternance des joueurs */
    function changePlayer() {
        if (aQuiLeTour === "--couleurJ1"){
            aQuiLeTour = "--couleurJ2"
        } else {
            aQuiLeTour = "--couleurJ1"
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
    const buttonReplayClic = document.querySelector("#popup h6")
        
        /* Le bouton a bien été récupéré ? */
        if (buttonReplayClic) {

            /* S'il y a clic... on appel la fonction de réinitialisation de la partie */
            buttonReplayClic.addEventListener("click", () => {

                /* on appel la fonction de réinitialisation de la partie */
                reinitiateGame()

                /* Puis on cache la fenetre */
                hidePopup()
                }
            )
        } else {
            console.log("Bouton rejouer n'ont récupéré")
        }
    }                


/**********************
* LANCEMENT ET APPELS *
***********************/
chargementMenu()
configurationMenu()
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

    /* Incorporer les nouveaux textes et couleur */
    showPopup.style.backgroundColor = winnerPopup
    h3Popup.innerText = "Victoire"
    pPopup.innerText = `${couleurWinner} a aligné 4 jetons`

    /*Afficher le popup*/
    showPopup.style.display = "block"

    /* Appel de la fonction pour savoir si les joueurs veulent faire une nouvelle partie */
    playAgain ()

}

/* cacher le message de victoire */
function hidePopup() {

/*Fonction de configuration du menu : adressage et désactivation de bouton */
function configurationMenu(){
    document.querySelector("#soloMode").disabled = true
    document.querySelector("#duoMode").onclick = function(){window.location.href = "jeu.php"}
    document.querySelector("#online").disabled = true
    document.querySelector("#configuration").disabled = true
    document.querySelector("#scoresPage").onclick = function(){window.location.href = "pages/scores.php"}
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

/* Message si colonne déjà pleine */
function alertMessage(message) {

    /* On récupère le paragraphe du message */
    let alertMessage = document.querySelector("#message p")

    /* On le change avec le message à envoyer */
    alertMessage.innerText = message

    /* Et on l'affiche dans la fenetre */
    let fenetreMessage = document.getElementById("message")
    fenetreMessage.style.display = "block"

    /*Après 3 secondes on cache à nouveau la fenetre*/
    setTimeout( ()=> {
        fenetreMessage.style.display = "none"
    }, 3000)
}