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
    <title>Session pleine</title>

    <!--chargement du css-->
    <link rel="stylesheet" href="../styles/style.css">

</head>
<body>

<!-- header -->
<?php include '../pages/header.php'; ?>

    <div class="message">
        <p>La session est déjà pleine. Veuillez réessayer plus tard.</p>
        <!--Bouton quitter-->
        <div>
            <a href="../index.php" id="buttonPageScores">Quitter</a>
        </div>
    </div>
</body>
</html>