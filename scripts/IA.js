/****************/
    /* FONCTIONS IA */
    /****************/

    /*Fonction pour déterminer si c'est à l'IA de jouer */
    function isComputerTurn(couleurDernierJoueur) {
        if(modeSolo && couleurDernierJoueur === "red"){
            IAplaying = true
            startComputerPlaying()
        } 
    }
    
    /* Fonction principal d'activation/désactivation de l'IA*/
    async function startComputerPlaying() {

        /* On désactive les possibilités d'action du joueur humain*/
        desactiveClickOver()

        /*Après une petite pause, on déterminer si l'IA à inséré un pion*/
        await paused(getRandomInt(250,2251))
        await IAColChoice()

        /*On relance le jeu pour l'humain*/
        IAplaying = false
        activeClickOver()

    }

    /* Fonction ou l'IA détermine quelle colonne choisir */
    function IAColChoice() {

        //Création tableau de colonne pour stocker la meilleure valeur de chaque colonne
        let colonneAChoisir = []

        // Parcourir chaque colonne
        for (let iCol = 0; iCol <= tablJeu.length ; iCol++) {
            colonneAChoisir[iCol] = -1 // Initialiser avec -1 pour indiquer aucune colonne pleine trouvée
        
            // Parcourir chaque ligne depuis le bas pour cette colonne
            for (let iRow=5; iRow>-1; iRow--){ {
                if (tablJeu[iRow][iCol] === "") {

                    //On a une cellule vide pour la colonne, recherche de l'intérêt jaune & rouge
                    let newIndice = 0
                    let scoreRed = determinerScoreIA(iRow, iCol, "red")
                    let scoreYellow = determinerScoreIA(iRow, iCol, "yellow")

                    // Enregistrer le meilleur indice de la ligne vide
                    if(scoreYellow>=scoreRed){
                        newIndice = scoreYellow
                    } else {
                        newIndice = scoreRed
                    }
                    colonneAChoisir[iCol] = newIndice
                    break // Arrêter la recherche dès qu'une ligne vide est trouvée
                }
            }
        }
    }

        /*On compare les valeurs du tableau pour décider ou doit aller le pion*/
        let colonne = 0
        let valeurMAxCol = colonneAChoisir[0]

        for (let i = 0; i<7; i++){
            if (colonneAChoisir[i] > valeurMAxCol) {
                valeurMAxCol = colonneAChoisir[i]
                colonne = i

            /* Changement de colonne hasardeux en cas d'égalité, pour éviter toute prévisibilité */
            } else if (colonneAChoisir[i] === valeurMAxCol && getRandomInt(0,2)===1){
                colonne = i
            }
        }

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

    /*****************************************************
     * FONCTIONS DE DETECTION D'ALIGNEMENT POUR L'IA     *
     *****************************************************/

    /* Fonction de déterminantion du score global de la cellule */
    function determinerScoreIA(iRow, iCol, color) {
                    
        /* détection du nombre de jetons de la même couleur dans chaque alignements */
        let scoreAlign = []
        scoreAlign[0] = detectionRowPlayedIA (iRow, iCol, color)
        scoreAlign[1] = detectionColPlayedIA (iRow, iCol, color)
        scoreAlign[2] = detectionDiagonalesIA(iRow, iCol, +1, color)
        scoreAlign[3] = detectionDiagonalesIA (iRow, iCol, -1, color)

        /* Quel est le score le plus intéressant ? */
        let scoreFinal = -1
        for(i=0; i<4; i++){
            if(scoreAlign[i]> scoreFinal) {
                scoreFinal = scoreAlign[i]
            } else if (scoreAlign[i] === scoreFinal) {
                scoreFinal++
            }
        }

        //On renvoie le score de la cellule
        return scoreFinal
    }

        /* Fonction de détection des lignes */
        function detectionRowPlayedIA(iRow, iCol, color){

            let nbrJetonsAlignes = 1
            let nextCellRow = iRow

            /* On vérifie les 4 cases adjacentes suivantes en ligne si elles ne sont pas en dehors du tableau*/
            let loopbreak = false
            for(let nextCellCol=iCol+1; nextCellCol<iCol+4 && nextCellCol<7 && loopbreak===false; nextCellCol++){
                let result = detectionCellContent(nextCellRow, nextCellCol, color)
                if(result===1){nbrJetonsAlignes++}
                if(result===-1){
                    loopbreak = true
                }
            }

            /* On vérifie les 4 cases adjacentes précédentes en ligne si elles ne sont pas en dehors du tableau*/
            loopbreak = false
            for(let nextCellCol=iCol-1; nextCellCol>iCol-4 && nextCellCol>-1 && loopbreak===false; nextCellCol--){
                let result = detectionCellContent(nextCellRow, nextCellCol, color)
                if(result===1){nbrJetonsAlignes++}
                if(result===-1){
                    loopbreak = true
                }
            }

            // Calcul et envoie du score en privilégiant légèrement les jaunes
            let newScore = nbrJetonsAlignes*nbrJetonsAlignes*nbrJetonsAlignes
            //if(color==="yellow"){newScore++}
            return newScore
        }

        /* Fonction de détection des colonnes */
        function detectionColPlayedIA(iRow, iCol, color){

            let nbrJetonsAlignes = 1
            let nextCellCol = iCol

            /* On vérifie les 4 cases adjacentes suivantes en colonne si elles ne sont pas en dehors du tableau*/
            let loopbreak = false
            for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6 && loopbreak===false; nextCellRow++){
                let result = detectionCellContent(nextCellRow, nextCellCol, color)
                if(result===1){nbrJetonsAlignes++}
                if(result===-1){
                    loopbreak = true
                }
            }

            /* On vérifie les 4 cases adjacentes précédentesx en colonne si elles ne sont pas en dehors du tableau*/
            loopbreak = false
            for(nextCellRow=iRow-1; nextCellRow>iRow-4 && nextCellRow>-1 && loopbreak===false; nextCellRow--){
                let result = detectionCellContent(nextCellRow, nextCellCol, color)
                if(result===1){nbrJetonsAlignes++}
                if(result===-1){
                    loopbreak = true
                }
            }

            // Calcul et envoie du score en privilégiant légèrement les jaunes s'ils sont à un jeton de la victoire
            let newScore = nbrJetonsAlignes*nbrJetonsAlignes*nbrJetonsAlignes
            if(color==="yellow" && newScore>26){newScore++}
            return newScore
        }

        /* Fonction de détection des diagonales */
        function detectionDiagonalesIA(iRow, iCol, increment, color){

            let nbrJetonsAlignes = 1
            let nextCellCol = iCol

            /* On vérifie les 4 cases adjacentes suivantes en diag si elles ne sont pas en dehors du tableau*/
            let loopbreak = false
            for(nextCellRow=iRow+1; nextCellRow<iRow+4 && nextCellRow<6 && loopbreak===false; nextCellRow++){

                /* On augmente également la ligne de 1 pour créer la diagonale */
                    nextCellCol=nextCellCol+increment

                    /* On execute le code uniquement si cette case ne sort pas du tableau */
                    if(nextCellCol<7 && nextCellCol>-1){

                        let result = detectionCellContent(nextCellRow, nextCellCol, color)
                        if(result===1){nbrJetonsAlignes++}
                        if(result===-1){
                            loopbreak = true
                        }
                    } else {
                    break // On est sorti du tableau
                }

            }

            /* Et on vérifie les 4 cases adjacentes précedentes en diag si elles ne sont pas en dehors du tableau*/
            nextCellCol = iCol
            loopbreak = false
            for(nextCellRow=iRow-1; nextCellRow<iRow+4 && nextCellRow>-1 && loopbreak===false; nextCellRow--){

                /* On inverse également le sens de la colonne pour créer la diagonale */
                    nextCellCol=nextCellCol-increment

                    /* On execute le code uniquement si cette case ne sort pas du tableau */
                    if(nextCellCol<7 && nextCellCol>-1){

                        let result = detectionCellContent(nextCellRow, nextCellCol, color)
                        if(result===1){nbrJetonsAlignes++}
                        if(result===-1){
                            loopbreak = true
                        }
                    } else {
                    break // On est sorti du tableau
                }
            }

            // Calcul et envoie du score en privilégiant légèrement les jaunes
            let newScore = nbrJetonsAlignes*nbrJetonsAlignes*nbrJetonsAlignes
            //if(color==="yellow"){newScore++}
            return newScore
        }

            /* Fonction qui détermine le contenu de la cellule et incrémente le nombr de jetons si nécessaire. 
            Si jeton d'une autre couleur, la boucle de test est interrompu */
            function detectionCellContent(nextCellRow, nextCellCol, color){
                        
                /* Et on lance la fonction pour savoir ce que contient la nouvelle cellule testée */
                let contenuCell=tablJeu[nextCellRow][nextCellCol]
                    switch (contenuCell){
                        case color :
                        return 1
                        case "" :
                        return 0
                        default :
                        return -1
                }
            }