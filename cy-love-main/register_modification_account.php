<?php
    session_start();

    $servername = "localhost";
    $login = "root";
    $pass = "";
    $database = "cy_love_database";
    
    //server connexion test
    try{    
        $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode
        
        /* -------------- Variables -------------- */
        // 1. General variables
        $new_Pseudo = $_POST["Pseudo"];
        $new_Password =  $_POST["Password"];
        $new_Firstname = $_POST["Firstname"];
        $new_Name = $_POST["Name"];
        $new_Email = $_POST["Email"];
        $new_Gender = $_POST["Gender"];
        $new_Profession = $_POST["Profession"];
        $new_Preference = $_POST["Preference"];
        $ID = $_SESSION["ID"];
        
        // 2. Variables for upload profile picture
        $file_user = "Accounts/ID_" . $ID;
        $target_file = $file_user . "/profile_picture/profile_picture_ID_" . $ID . ".jpg";
        $uploadOK = 1;
        $imgFileType = strtolower(pathinfo(basename($_FILES['Profile_picture']['name']),PATHINFO_EXTENSION));
            //pathinfo() : get image extension
            //basename() : show filename uploaded (not all path)


        /* -------------- Verification tests -------------- */
        if( strlen($new_Password)<=0 || strlen($new_Pseudo)<=0 || strlen($new_Email)<=0 || strlen($new_Firstname)<=0 || strlen($new_Name)<=0 ){
            $_SESSION['error_msg'] = "Aucun champ ne doit être vide !";
            header("Location: personal-account.php");
            exit;
        }
        if( ($imgFileType!=='jpg' && $imgFileType!=='jpeg') && $imgFileType!==''){
            $_SESSION['error_msg'] = "Seul le format JPG est accepté pour les photos de profil.";
            header("Location: personal-account.php");
            exit;
        }


        /* -------------- GET ALL INFOS ACCOUNT -------------- */
        $query_info_account = $connexion->prepare("SELECT * FROM user_info WHERE ID = :ID");
        $query_info_account->bindParam(':ID', $ID);
        $query_info_account->execute();
        $array_info_account = $query_info_account->fetchall(PDO::FETCH_NUM); // array with all info account
        

        /* -------------- MODIFY PSEUDO -------------- */
        $query1 = $connexion->prepare(//query = requête
            "SELECT ID, Pseudo FROM user_info WHERE BINARY Pseudo = :new_pseudo"
        ); //BINARY : permet de tenir compte de la casse des caractères
        $query1->bindParam(':new_pseudo', $new_Pseudo);
        $query1->execute();
        $array_same_pseudo = $query1->fetchall(PDO::FETCH_NUM); // array in array with same pseudos as the new pseudo entered (and their associated ID)
        //test how many identical pseudos as the new are in the database
        if( count($array_same_pseudo) >= 2){
            $_SESSION['error_msg'] = " ERREUR ETRANGE n°1000.<br>Le pseudo " . $new_Pseudo . " est déjà pris par AU MOINS un autre utilisateur !<br>Veuillez en choisir un autre.";
            header("Location: personal-account.php");
            exit;
        }
        elseif( count($array_same_pseudo) == 1 ){
            if( $array_same_pseudo[0][0] == $ID){
                //we meet the user connected pseudo, this pseudo does not belong (n'appartient pas) to someone else
                //pseudo not changed
            }
            else{
                $_SESSION['error_msg'] = "Le pseudo " . $new_Pseudo . " est déjà pris par un autre utilisateur !<br>Veuillez en choisir un autre";
                header("Location: personal-account.php");
                exit;
            }

        }
        // NEW PSEUDO correct (not belong to someone else)
        else{               //change user pseudo : count($array_same_pseudo) == 0
            $query_pseudo_update = $connexion->prepare(
                "UPDATE user_info
                SET Pseudo = :new_pseudo
                WHERE ID = :ID"
            );
            $query_pseudo_update->bindParam(':new_pseudo', $new_Pseudo);
            $query_pseudo_update->bindParam(':ID', $ID);
            $query_pseudo_update->execute();
            $_SESSION['Pseudo'] = $new_Pseudo;
        }


        /* -------------- MODIFY INFO ACCOUNT : firstname, name, email, gender, password, profession -------------- */
        $query2 = $connexion->prepare(
            "UPDATE user_info
            SET Mot_de_passe = :new_pwd, Prénom = :new_firstname, Nom = :new_name, Email = :new_email, Preference = :new_preference, Genre = :new_gender, Profession = :new_profession
            WHERE ID = :ID;"
        );
        $query2->bindParam(':new_pwd', $new_Password);
        $query2->bindParam(':new_firstname', $new_Firstname);
        $query2->bindParam(':new_name', $new_Name);
        $query2->bindParam(':new_email', $new_Email);
        $query2->bindParam(':new_gender', $new_Gender);
        $query2->bindParam(':new_preference', $new_Preference);
        $query2->bindParam(':new_profession', $new_Profession);
        $query2->bindParam(':ID', $ID);
        $query2->execute();
        $_SESSION['error_msg'] = "Vos informations ont été mises à jour.";
        header("Location: personal-account.php");
        exit;
    }

    catch (PDOException $e){
        echo "Connexion impossible : " . $e->getMessage();
    }
?>