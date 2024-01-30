<?php
//Pas de mise en cache
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Script de communication avec données JSON
header('Content-Type: application/json');

// On récupère la configuration
require_once(__DIR__ . '/../config/mysql.php');

try {
    // Connexion à la BDD...
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
        $action = $donnees['action'] ?? 'insert';

        if ($action == 'updateUser1') {
            // Action pour mise à jour de user1
            $user1 = $donnees['user1'] ?? 'user1';
            $userId = $donnees['ID']; 

            try {
                $statement = $mysqlClient->prepare("UPDATE jeuonline SET user1 = :user1 WHERE ID = :ID");
                $statement->execute(['user1' => $user1, 'ID' => $userId]);
                echo json_encode(['success' => 'Utilisateur mis à jour.']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }
        } else if ($action == 'updateUser2') { 
              // Action pour mise à jour de user2
            $user1 = $donnees['user1'] ?? null;
            $userId = $donnees['ID']; 

            try {
                $statement = $mysqlClient->prepare("UPDATE jeuonline SET user2 = :user2 WHERE ID = :ID");
                $statement->execute(['user2' => $user1, 'ID' => $userId]);
                echo json_encode(['success' => 'Utilisateur mis à jour.']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }
        } else {
            // Logique pour l'insertion
            try {
                $date = $donnees['date'];
                $user1 = $donnees['user1'];
                $user2 = $donnees['user2'];
                $row1 = $donnees['row1'];
                $col1 = $donnees['col1'];
                $row2 = $donnees['row2'];
                $col2 = $donnees['col2'];
                $etat = $donnees['etat'];

                $statement = $mysqlClient->prepare("INSERT INTO jeuonline (date, user1, user2, row1, col1, row2, col2, etat) VALUES (:date, :user1, :user2, :row1, :col1, :row2, :col2, :etat)");
                $statement->execute([
                    'date' => $date,
                    'user1' => $user1,
                    'user2' => $user2,
                    'row1' => $row1,
                    'col1' => $col1,
                    'row2' => $row2,
                    'col2' => $col2,
                    'etat' => $etat
                ]);

                echo json_encode(['success' => 'Nouvelle entrée ajoutée.']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }
        }
    }
} catch (Exception $exception) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => $exception->getMessage()]);
}
