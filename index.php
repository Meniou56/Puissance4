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



<!--Message d'alerte-->
<div id="message">
    <p>Paragraphe</p>
    </div> 


<!--POPUP PRINCIPAL-->
<div id="popup" class="animate">
    <!--Contenu du pop-up-->
    <button id="soloMode" class="animate" title="Seul contre l'ordinateur">Défi IA</button>
    <button id="duoMode" class="animate" title="Face-à-Face derrière un même écran">Duel local</button>
    <button id="online" class="animate" title="Affrontement via internet - Version beta">Match en ligne</button>
    <button id="configuration" class="animate" title="Pour changer les paramètres">Configuration</button>
    <button id="scoresPage" class="animate" title="Pour consulter les scores">Scores</button>
</div> 


<!--Chargement du JS-->
<script src="scripts/script.js"></script>

</body>
</html>