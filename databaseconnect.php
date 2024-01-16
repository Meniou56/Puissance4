<?php
require_once(__DIR__ . '/config/mysql.php');

try {
    $mysqlClient = new PDO(
        sprintf('mysql:host=%s;dbname=%s;port=%s;charset=utf8', MYSQL_HOST, MYSQL_NAME, MYSQL_PORT),
        MYSQL_USER,
        MYSQL_PASSWORD
    );
    $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $exception) {
    die('Erreur : ' . $exception->getMessage());
}

/*Test de récupération */

$sql = "SELECT * FROM scores";
$scores = $mysqlClient->prepare($sql);
$scores->execute();

foreach ($scores as $row) {
    echo "Nom : " . $row['nom'] . "<br>";
    echo "Date : " . $row['date'] . "<br>";
    echo "Scores : " . $row['score'] . "<br>";
}