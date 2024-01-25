<?php
//Pas de misen en cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Script de communication avec données JSON
header('Content-Type: application/json');

// On récupère la configuration
require_once(__DIR__ . '/../config/mysql.php');

// Connexion à la BDD...
try {
    $mysqlClient = new PDO(
        sprintf('mysql:host=%s;dbname=%s;port=%s;charset=utf8', MYSQL_HOST, MYSQL_NAME, MYSQL_PORT),
        MYSQL_USER,
        MYSQL_PASSWORD
    );
    $mysqlClient->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // On vérifie qu'il s'agit d'une requête de POST
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        // On récupère les données
        $donnees = json_decode(file_get_contents('php://input'), true);

        // Assignation des variables
        $ID = $donnees['ID'];
        $user = $donnees['user'];
        $row = $donnees['row'];
        $col = $donnees['col'];

        // Requête SQL insertion de données
        try {
            $statement = $mysqlClient->prepare("INSERT INTO jeuonline (ID, user, row, col) VALUES (:ID, :user, :row :col)");
            $statement->execute([
                'ID' => $ID,
                'user' => $user,
                'row' => $row,
                'col' => $col,
            ]);

        } catch (PDOException $exception) {
            // Gérer l'erreur
            http_response_code(500);
            echo json_encode(['error' => $exception->getMessage()]);
        }
    }

    // En cas d'erreur
    } catch (Exception $exception) {

        //Si erreur, réponse JSON/erreur 500
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => $exception->getMessage()]);
    }

