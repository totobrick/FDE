<?php
    // Start the session
    session_start();
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();

    // Connexion à la base de données
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "cy_love_database";
    

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier si l'ID du msg est passé en POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['ID_msg'])) {
            $ID_msg = $_POST['ID_msg'];
            // Supprimer le msg
            $delete_sql = "UPDATE messages SET Supprimé = NULL WHERE ID_msg = :id";
            $delete_stmt = $conn->prepare($delete_sql);
            $delete_stmt->bindParam(':id', $ID_msg);
            $delete_stmt->execute();

            $response['success'] = true;
            $response['message'] = "Message rendu avec succès (ID: " . $ID_msg . ").";
            echo json_encode($response);
            exit;
            
        }
        else {
            $_SESSION['error_msg'] = "ID du message manquant.";
            // En cas d'erreur
            $response['success'] = false;
            $response['message'] = "Erreur lors de la réactivation du message : " . $e->getMessage();
            echo json_encode($response);
            exit;
        }
    } catch (PDOException $e) {
        echo "Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage());
    }
?>