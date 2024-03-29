<?php 
//Pas de misen en cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Puissance 4 - Scores</title>

    <!--chargement du css-->
    <link rel="stylesheet" href="../styles/style.css">

</head>
<body>
    
<!-- header -->
<?php include './header.php'; ?>

<div class="flexColumn">
    <!--Bouton de tri-->
    <select id="triScores">
        <option disabled selected>Trier par :</option>
        <option value="modeJeu">Mode de jeu</option>
        <option value="chrono">Plus récents en premier</option>
        <option value="anteChrono">Plus anciens en premier</option>
        <option value="alphabetique">Ordre alphabétique</option>
        <option value="anteAlphabetique">Ordre alphabétique inversé</option>
        <option value="highScores">Scores élevés en premier</option>
        <option value="lowScores">Scores minimum en premier</option>
    </select>
    <br>  

    <!--En tête du tableau de score-->
    <table id="tableauScore">
        <thead>    
            <tr>
                <th>Date</th>
                <th>Nom</th>
                <th>Score</th>
                <th>Mode</th>
            </tr>
        </thead>
        <tbody id="tableauBody">

                <!--C'est ici que vont être inséré les résultats-->

        </tbody>
    </table>
</div>

<!--Bouton-->
<div>
    <a href="../index.php" id="buttonPageScores">Menu principal</a>
</div>



<!--Chargement du JS-->
<script src="../scripts/scriptScores.js"></script>

</body>
</html>