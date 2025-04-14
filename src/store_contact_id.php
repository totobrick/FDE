<?php
    session_start();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_id'])) {
        $_SESSION['ID_receiver'] = $_POST['contact_id'];
        // Répondre pour indiquer que l'ID a été stocké avec succès
        echo "ID du contact enregistré avec succès : " . $_SESSION['ID_receiver'];

        $servername = "localhost";
        $login = "root";
        $pass = "";
        $database = "cy_love_database";

        //server connexion test
        try{
            $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode

            $query_pseudo_contact = $connexion->prepare("
                    SELECT Pseudo FROM user_info
                    WHERE ID = :ID");
            $query_pseudo_contact->bindParam(':ID', $_SESSION['ID_receiver']);
            $query_pseudo_contact->execute();
            $pseudo_contact = $query_pseudo_contact->fetchColumn(); //récupère seulement la valeur, pas un tableau
            $_SESSION['Pseudo_receiver'] = $pseudo_contact;
            echo "Pseudo du contact enregistré avec succès : " . $_SESSION['Pseudo_receiver'];
            exit;
        }
        catch (PDOException $e){
            echo "Connexion impossible à la base de données: " . $e->getMessage();
            exit;
        }
    } else {
        // Gérer les erreurs
        echo "Une erreur est survenue lors de la sauvegarde de l'ID du contact.";
    }
?>