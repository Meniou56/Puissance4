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

        if($action == 'updateEtat'){
            //Action pour mise à jour de l'etat de la partie
            $etat = $donnees['etat'] ?? null;
            $userId = $donnees['ID'];

            try{
                $statement = $mysqlClient->prepare("UPDATE jeuonline SET etat = :etat WHERE ID = :ID");
                $statement->execute(['etat' => $etat, 'ID' => $userId]);
                echo json_encode(['success' => 'Etat mis à jour']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }

        } else if ($action == 'updateGameYellow') { 
            // Action pour mise à jour du jeu après une action de jaune
          $etat = $donnees['etat'];
          $row2 = $donnees['row2'];
          $col2 = $donnees['col2'];
          $userId = $donnees['ID']; 

          try {
              $statement = $mysqlClient->prepare("UPDATE jeuonline SET etat = :etat, row2 = :row2, col2 = :col2 WHERE ID = :ID");
              $statement->execute([
                'etat' => $etat,
                'row2' => $row2,
                'col2' => $col2,
                'ID' => $userId]);
              echo json_encode(['success' => 'tableau mis à jour après que jaune est joué']);
          } catch (PDOException $exception) {
              http_response_code(500);
              echo json_encode(['error' => $exception->getMessage()]);
          }
        } else if ($action == 'updateGameRed') { 
            // Action pour mise à jour du jeu après une action de rouge
            $etat = $donnees['etat'];
            $row1 = $donnees['row1'];
            $col1 = $donnees['col1'];
            $userId = $donnees['ID']; 
  
            try {
                $statement = $mysqlClient->prepare("UPDATE jeuonline SET etat = :etat, row1 = :row1, col1 = :col1 WHERE ID = :ID");
                $statement->execute([
                  'etat' => $etat,
                  'row1' => $row1,
                  'col1' => $col1,
                  'ID' => $userId]);
                echo json_encode(['success' => 'tableau mis à jour après que rouge est joué']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }

        } else if ($action == 'updateUser1') {
            // Action pour mise à jour de user1
            $user1 = $donnees['user1'] ?? null;
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
            $user2 = $donnees['user2'] ?? null;
            $userId = $donnees['ID']; 

            try {
                $statement = $mysqlClient->prepare("UPDATE jeuonline SET user2 = :user2 WHERE ID = :ID");
                $statement->execute(['user2' => $user2, 'ID' => $userId]);
                echo json_encode(['success' => 'Utilisateur mis à jour.']);
            } catch (PDOException $exception) {
                http_response_code(500);
                echo json_encode(['error' => $exception->getMessage()]);
            }

        } else {
            // Logique pour l'insertion et mise à jour BDD(suppression anciennes lignes)
            try {

                /*Phase de nettoyage*/
                /********************/
                //Suppression des lignes-parties périmées (plus d'un jour)
                $deleteStatement = $mysqlClient->prepare("DELETE FROM jeuonline WHERE date < NOW() - INTERVAL 1 DAY");
                $deleteStatement->execute();

                // Suppression des parties en "prepare" depuis plus de 10 minutes
                $deletePreparingGamesStatement = $mysqlClient->prepare("DELETE FROM jeuonline WHERE etat = 'prepare' AND date < NOW() - INTERVAL 10 MINUTE");
                $deletePreparingGamesStatement->execute();

                // Suppression des parties où user1 ou user2 sont en "waiting" ou "loading" depuis plus de 15 minutes
                $deleteWaitingLoadingGamesStatement = $mysqlClient->prepare("DELETE FROM jeuonline WHERE (user1 = 'waiting' OR user1 = 'loading' OR user2 = 'waiting' OR user2 = 'loading') AND date < NOW() - INTERVAL 15 MINUTE");
                $deleteWaitingLoadingGamesStatement->execute();

                /*Phase de création*/
                /*******************/
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
