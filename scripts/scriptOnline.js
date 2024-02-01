/***************/
/* Jeux online */
/***************/

/*****************************/
/* FONCTIONS EN COURS DE JEU */
/*****************************/

// Fonction pour charger les parties, en trouver une ou la créer, puis demander le nom de joueur
async function initialiseLoadOnline() {
    let jeuOnline = await readSQL("ALL")

    // On enregistre la ligne qui servira pour toute la partie
    serverSQL = jeuOnline[jeuOnline.length-1]

    //Si jeuOnline est vide ou si partie pleine, il faut créer une partie
    if(jeuOnline.length === 0 || (serverSQL.user1 !== "waiting" && serverSQL.user2 !== "waiting")){
        let chargeUtile = chargeUtileNewParty()
        await writingInSQL(chargeUtile)
        initialiseLoadOnline() // On recharge à nouveau jeuOnline
    }

    // On check la dernière ligne de BDD (dernière partie créée)
    if(serverSQL.user1 === "waiting"){ //ajouter une condition type (dernière partie créé il y a moins de 30")???
        playerRed = true
        formNomJoueur("Nom de joueur")
    } else if (serverSQL.user2 === "waiting"){
        playerYellow = true
        formNomJoueur("Nom de joueur")
    } else {
        //Sinon on recommence la boucle de chargement
        initialiseLoadOnline()
    }
}

/******************************************/
/* FONCTIONS DE COMMUNICATION AVEC LA BDD */
/******************************************/
    /************/
    /*EN LECTURE*/
    /************/

    /* Fonction de maj des informations depuis la BDD */
    async function readSQL(ID){
        try {

            // Chargement des données correspondant à l'ID
            const response = await fetch('data/onlineread.php?id=' + ID + '&_=' + new Date().getTime()) //Pour être sur que les données sont maj

            if(!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`)
            }

            // Transformation en JSON
            const donnees = await response.json()
            return donnees

        } catch (erreur) {
            console.error('Erreur lors du chargement des données', erreur)
        }
    }


/***************/
/* EN ECRITURE */
/***************/

// Construction de la charge utile à envoyer pour la création d'une nouvelle partie
function chargeUtileNewParty(){
    const actualTime = new Date()

    //Transformation de la date en format datetime(SQL)
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }

    const formattedDateTime = actualTime.getFullYear() + '-' +
        padTo2Digits(actualTime.getMonth() + 1) + '-' +
        padTo2Digits(actualTime.getDate()) + ' ' +
        padTo2Digits(actualTime.getHours()) + ':' +
        padTo2Digits(actualTime.getMinutes()) + ':' +
        padTo2Digits(actualTime.getSeconds())

    // Chargement des paramètres
    const newData = {
        "action": "insert",
        "date": formattedDateTime,
        "user1": "waiting",
        "user2": "waiting",
        "row1" : -1,
        "col1" : -1,
        "row2" : -1,
        "col2" : -1,
        "etat" : "prepare"
    }

    // Retour de charge utile
    return newData
}

/* Fonction d'initialisation d'enregistrement du nom dans la BDD */
async function savingOnlineName(name){
    let chargeUtile = chargeUtileName(name)
    await writingInSQL(chargeUtile)
}


// Construction charge utile des noms dans la BDD
function chargeUtileName(name){

    // Variable charge utile
    let newData

    // Chargement des paramètres
    if(playerRed){
        newData = {
            "action": "updateUser1",
            "user1": name,
            "ID": serverSQL.ID
        }
    }else if(playerYellow){
        newData = {
            "action": "updateUser2",
            "user2": name,
            "ID": serverSQL.ID
        }
    }else{
        console.log("Erreur lors de l'envoie du nom à la BDD")
    }
    return newData
}

// Construction charge utile lancement de partie
function chargeUtileLaunch(){

    // Variable charge utile
    let newData

    // Chargement des paramètres
    if(playerRed){
        newData = {
            "action": "updateEtat",
            "etat": "launched",
            "ID": serverSQL.ID
        }

    // En cas d'erreur
    }else{
        console.log("Erreur lors de l'envoie du lancement au niveau de la BDD")
    }
    return newData
}

// Construction charge utile insertion d'un jeton
function chargeUtileInGame(row, col, color){

    // Variable charge utile
    let newData

    if(color==="yellow"){

        // Chargement des paramètres jaune
        newData = {
            "action": "updateGameYellow",
            "etat": "rturn",
            "row2": row,
            "col2": col,
            "ID": serverSQL.ID
        }
    } else if(color==="red"){

        // Chargement des paramètres rouge
        newData = {
            "action": "updateGameRed",
            "etat": "yturn",
            "row1": row,
            "col1": col,
            "ID": serverSQL.ID
        }
    } else {
        console.log("Charge utile non créée : impossible de déterminer le joueur")
    }
    return newData
}

// Fonction d'envoie de données de partie vers SQL
async function writingInSQL(newData) {

    try {
        // Ecriture des nouvelles données
        const reponse = await fetch('./data/onlinewrite.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData)
        })

        // Vérification
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`)
        }

    } catch (erreur) {
        console.error('Erreur lors de l\'envoie des données', erreur)
    }
}

/**********************************************************/
/* FONCTIONS DE LANCEMENT ET INITIALISATION PARTIE ONLINE */
/**********************************************************/
// Fonction de mise à jour de la partie BDD
async function checkBDDGame(){
    let newServerSQL = await readSQL(serverSQL.ID)
    serverSQL = newServerSQL[0]
    return serverSQL
}

//Fonction de gestion d'activation du tour de chaque joueur
async function waitingTurn(who){
    serverSQL = await checkBDDGame()

    //A qui est-ce le tour ?
    if(serverSQL.etat === who){

        //On récupère les informations de jetons inséré
        if(who=== "yturn"){
            rafraichirTablJeu(serverSQL.row1, serverSQL.col1, "red")
            activeClickOver()
        } else if(who==="rturn"){
            rafraichirTablJeu(serverSQL.row2, serverSQL.col2, "yellow")
            activeClickOver()
        } else {
            alertMessage("erreur BDD : insertion pion", "--couleurMenuAlerte")
        }
    } else {

        //Si ce n'est pas le tour de ce joueur, on patiente encore
        await paused(2500)
        waitingTurn(who)
    }
}

/* Fonction d'attente d'autres joueurs/maj joueurs ? ?*/
async function startCheckForGame(){

    //Maj des informations pour avoir les noms
    await checkBDDGame()
    displayBoardName()
    waitingOnlineWindow()

    //On vérifie si tout à été maj // UN truc à vérifier par ici ???
    if(serverSQL.user1 !=="waiting" && serverSQL.user2 !=="waiting"){
        
        //Si joueur jaune, maj du bouton d'attente
        if(playerYellow){
            let showPopup = document.getElementById("popup")
            let replayButton = showPopup.querySelector("#replay")
            replayButton.innerText = "Prêt ?"
            replayButton.style.backgroundColor = "green"

            //La partie a été lancée pour jaune ?
            if(serverSQL.etat === "launched"){
                launchingOnlineGame()
                } 

            //Sinon, on recharge depuis la BDD après 2,5s
            await paused(2500)
            startCheckForGame()
        }

        //Si joueur rouge, prêt à lancer la partie
        if(playerRed){
            document.querySelector("#replay").disabled = false
        }

    } else {
        await paused(2500)
        startCheckForGame()
    }
}

/* Fonction d'atttribution de joueur */
function displayBoardName(){

        //Récupération des emplacements d'affichage
        let nameOnBoardPlayer1 = document.getElementById("Player1")
        let nameOnBoardPlayer2 = document.getElementById("Player2")

        //Attribution des couleurs
        nameOnBoardPlayer1.style.color = "red" 
        nameOnBoardPlayer2.style.color = "yellow"

        // Changement des noms
        nameOnBoardPlayer1.innerText = serverSQL.user1
        nameOnBoardPlayer2.innerText = serverSQL.user2
}

//Fonction de lancement de la partie
async function launchingOnlineGame(){

    //Envoie de l'information à jaune
    if(playerRed){
        let chargeLaunch = chargeUtileLaunch()
        await writingInSQL(chargeLaunch)
    }
    displayIDElement("popup", "none")
    startingGame()
}

//Fonction de mise à jour de la partie (insertion d'un pion)
async function updateGame(row, col, color){

        let chargeGame = chargeUtileInGame(row, col, color)
        await writingInSQL(chargeGame)

}