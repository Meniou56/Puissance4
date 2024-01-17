<?php
require_once(__DIR__ . '/../config/mysql.php');
require_once(__DIR__ . '/../databaseconnect.php');
?>

<?php $sql = "SELECT * FROM scores";
$scores = $mysqlClient->prepare($sql);
$scores->execute();
?>

<!--foreach ($scores as $row) {
    echo "Nom : " . $row['nom'] . "<br>";
    echo "Date : " . $row['date'] . "<br>";
    echo "Scores : " . $row['score'] . "<br>";
}-->

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
            </tr>

        <!-- Tableau des scores -->
        <?php foreach ($scores as $row): 
            
            /*Transformation de la date*/
            $fullDate = $row['date'];
            $date = new DateTime($fullDate);
            $displayDate = $date->format('Y-m-d H:i');

            ?>
            <tr>
                <td><?php echo $displayDate?></td>
                <td><?php echo $row['nom']?></td>
                <td><?php echo $row['score']?></td>
        <?php endforeach ?>

        </thead>
        <tbody id="tableauBody">

                <!--C'est ici que vont être inséré les résultats-->

        </tbody>
    </table>
</div>

<!--Bouton-->
<div class="divButtonPageScores">
    <a href="../index.php" id="buttonPageScores">Menu principal</a>
</div>



<!--Chargement du JS-->
<!--<script src="../scripts/scriptScores.js"></script>-->

</body>
</html>