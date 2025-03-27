<?php
    // Start the session
    session_start();

    // Connexion à la base de données
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "cy_love_database";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Vérifier si l'ID de l'utilisateur est passé en POST
        if (isset($_POST['id_user_delete'])) {
            $id_user_delete = $_POST['id_user_delete'];

            // Récupérer l'email de l'utilisateur avant de le supprimer
            $sql = "SELECT email FROM user_info WHERE ID = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $id_user_delete);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $email = $row['email'];

                // Ajouter l'email à la table des bannis
                $ban_sql = "INSERT INTO bannis (email, date_ban) VALUES (:email, CURDATE())";
                $ban_stmt = $conn->prepare($ban_sql);
                $ban_stmt->bindParam(':email', $email);
                $ban_stmt->execute();

                // Supprimer l'utilisateur
                $delete_sql = "DELETE FROM user_info WHERE ID = :id";
                $delete_stmt = $conn->prepare($delete_sql);
                $delete_stmt->bindParam(':id', $id_user_delete);
                $delete_stmt->execute();

                $_SESSION['error_msg'] = "Utilisateur supprimé et banni avec succès.";
                header("Location: admin.php");
                exit;
            }
            else {
                $_SESSION['error_msg'] = "Utilisateur non trouvé.";
                header("Location: admin.php");
                exit;
            }
        }
        else {
            $_SESSION['error_msg'] = "ID utilisateur manquant.";
            header("Location: admin.php");
            exit;
        }
    } catch (PDOException $e) {
        echo "Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage());
    }
?>