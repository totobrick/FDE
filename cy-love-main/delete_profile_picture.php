<?php
    session_start();
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();

    $servername = "localhost";
    $login = "root";
    $pass = "";
    $database = "cy_love_database";
    
    //server connexion test
    try {
        $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode
        
        /* -------------- Variables -------------- */
        // 1. General variables
        $ID = $_SESSION["ID"];
        
        // 2. Get path of personal picture
        $query_PP = $connexion->prepare("
                SELECT Photo_de_profil FROM user_info
                WHERE ID = :ID");
        $query_PP->bindParam(':ID', $ID); //bind parameters
        $query_PP->execute();
        $path_img = $query_PP->fetch(PDO::FETCH_ASSOC); //associative array
        //print_r($path_img);

        // 3. Delete profile picture file
        $path_img_PP = $path_img['Photo_de_profil'];
        if (file_exists($path_img_PP)){
            unlink($path_img_PP);       // unlink : delete file (irreversible)
            echo "Photo de profil supprimé avec succès.";
        }
        else{
            echo "Le chemin " . $path_img_PP . " ne mène pas à la photo de profil. \n Aucune suppression effectuée.";
            exit;
        }

        // 4. Update database
        $query_update_database = $connexion->prepare(
            "UPDATE user_info
            SET Photo_de_profil = ''
            WHERE ID = :ID");
        $query_update_database->bindParam(':ID', $ID); //bind parameters
        $query_update_database->execute();
        //echo "\nBase de données mise à jour.";
        exit;
    }
    catch (PDOException $e){
        echo "Connexion impossible : " . $e->getMessage();
    }
?>