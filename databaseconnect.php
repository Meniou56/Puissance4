<?php

// On récupère la configuration
require_once(__DIR__ . '/config/mysql.php');

// Connexion à la BDD...
try {
    $mysqlClient = new PDO(
        sprintf('mysql:host=%s;dbname=%s;port=%s;charset=utf8', MYSQL_HOST, MYSQL_NAME, MYSQL_PORT),
        MYSQL_USER,
        MYSQL_PASSWORD
    );
    $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // On récupère les données
    $stmt = $mysqlClient->query("SELECT * FROM scores");
    $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Transformation en JSON
    header('Content-Type: application/json');
    echo json_encode($resultats);

// En cas d'erreur
} catch (Exception $exception) {

    //Si erreur, réponse JSON/erreur 500
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => $exception->getMessage()]);
}

