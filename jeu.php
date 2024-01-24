<!--Session is starting-->
<?php session_start();?>

<!--Chargement des informations de mode de jeu-->
<?php $mode = isset($_GET['mode']) ? $_GET['mode']: 'solo'; //solo en valeur par défaut en cas de problème

// Nettoyage de la variable pour contrer une attaque XSS
$mode = htmlspecialchars($mode, ENT_QUOTES, 'UTF-8');?>

<!--Chargement des informations en mode multijoueur online -->
<?php

//Si mode multi Online
if($mode === "online"){
        //S'il y a déjà deux joueurs, la session est pleine
    if(isset($_SESSION['player1']) && isset($_SESSION['player2'])) {
        header('Location: pages/sessionFull.php');
        exit;
    } else {
        // Creation du joueur 1
    if (!isset($_SESSION['player1'])) {
        $_SESSION['player1'] = 'Joueur rouge';
        $currentPlayer = 'Joueur rouge';
        echo "rouge";
    } else {

    // Sinon création du joueur 2
        $_SESSION[('player2')] = "Joueur jaune";
        $currentPlayer = 'Joueur jaune';
        echo "jaune";
    }
    }
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puissance 4</title>

    <!--chargement du css-->
    <link rel="stylesheet" href="styles/style.css">

</head>
<body>

<!-- header -->
<?php include 'pages/header.php'; ?>

<!--Chargement des paramètres des variables superes gloables-->
<?php include 'data/varModeJeu.php' ?>

<!--Message d'alerte-->
<div id="message">
    <p>Paragraphe</p>
    </div>

<!--Tableau de jeu-->
<div id="tableauJeu">
    <table>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
                <div class="flecheSelection">&#x27A7;</div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
        </tr>
        <tr>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
            <td>
                <div class="carre_centre">
                    <div class="circle"></div>
                    <div class="fondBleu"></div>
    	        </div>
            </td>
        </tr>
    </table>

</div>

<!--Bouton quitter-->
<div>
    <a href="index.php" id="buttonPageScores">Quitter</a>
</div>

<!--POPUP PRINCIPAL-->
   <div id="popup">
    <!--Contenu du pop-up-->
    </div> 

<!-- Chargement du JS -->
<script src="scripts/scriptJeu.js"></script>

</body>
</html>