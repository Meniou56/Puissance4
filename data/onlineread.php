<?php
//Pas de misen en cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Script de communication avec données JSON
header('Content-Type: application/json');

// On récupère la configuration
require_once(__DIR__ . '/../config/mysql.php');

// Connexion à la BDD
try {
    $mysqlClient = new PDO(
        sprintf('mysql:host=%s;dbname=%s;port=%s;charset=utf8', MYSQL_HOST, MYSQL_NAME, MYSQL_PORT),
        MYSQL_USER,
        MYSQL_PASSWORD
    );
    $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // On récupère les paramètres concernant la ou les parties à récuperer
    $id = $_GET['id'] ?? null;

    if($id === 'ALL'){

        // On récupère les données de toute la table jeuOnline
        $stmt = $mysqlClient->query("SELECT * FROM jeuonline");
    } else {

        // Validation et nettoyage de l'ID
        if (!is_numeric($id) || $id <= 0) {
            throw new Exception("ID invalide");
        }

        //Préparation de la requête pour la partie spécifiée
        $stmt = $mysqlClient->prepare("SELECT * FROM jeuonline WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }

    // On récupère les résultats
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
?>