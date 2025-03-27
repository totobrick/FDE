<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit();
    }
    if (!isset($_POST["Code"])){
        $_SESSION['error_msg'] = "Vous n'avez entré aucun code.";
        header("Location: verif_register_enterMailCode.php");
        exit;
    }
    if ( !isset($_SESSION["Code"]) || !isset($_SESSION["register_gender"]) || !isset($_SESSION["register_Firstname"]) || !isset($_SESSION["register_Password"]) || !isset($_SESSION["register_Email"]) || !isset($_SESSION["register_Pseudo"]) || !isset($_SESSION["register_Password"]) || !isset($_SESSION["register_Preference"]) ){
        $_SESSION['error_msg'] = "Tout ou partie de vos informations personnelles ne sont plus dans des variables de session (page: verif_register_verifMailCode.php).";
        header("Location: register.php");
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $servername = "localhost";
        $login = "root";
        $pass = "";
        $dbname = "cy_love_database";

        try {
            $connexion = new PDO("mysql:host=$servername;dbname=$dbname", $login, $pass);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            /* -------------- Variables -------------- */
            if (!isset($_POST["Code"])){

            }
            $code_sent = $_POST["Code"];
            $code_good = $_SESSION["Code"];
            $gender = $_SESSION["register_gender"];
            $firstname = $_SESSION["register_Firstname"];
            $lastname = $_SESSION["register_Name"];
            $email = $_SESSION["register_Email"];
            $pseudo = $_SESSION["register_Pseudo"];
            $password = $_SESSION["register_Password"];
            $preference = $_SESSION["register_Preference"];
            

            /* -------------- VERIFICATIONS --------------
                On refait les vérifications déjà effectuées (mails bannis, pseudo unique) car la base de données
                a pu changer depuis l'exécution de verif_register.php.
                (ex : le pseudo était unique tout à l'heure, mais si la personne met longtemps à mettre le code de
                vérification reçu par mail, qq1 d'autre a pu s'inscrire en même temps avec le même pseudo entre temps)
            */
            // Check if the email is in the banned_emails table
            $query_banned = $connexion->prepare("SELECT Email FROM bannis WHERE Email = :email");
            $query_banned->bindParam(':email', $email, PDO::PARAM_STR);
            $query_banned->execute();
            $banned_email = $query_banned->fetch(PDO::FETCH_ASSOC);

            if ($banned_email) {
                unset($_SESSION["register_gender"], $_SESSION["register_Firstname"], $_SESSION["register_Name"], $_SESSION["register_Email"], $_SESSION["register_Pseudo"], $_SESSION["register_Preference"]);
                $_SESSION['error_msg'] = "Votre adresse email a été bannie. Veuillez contacter le support.";
                header("Location: register.php");
                exit;
            }

            // Vérification du pseudo unique
            $query1 = $connexion->prepare("SELECT ID FROM user_info WHERE BINARY Pseudo = :pseudo"); //BINARY : permet de tenir compte de la casse des caractères
            $query1->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
            $query1->execute();
            $array_same_pseudo = $query1->fetchAll(PDO::FETCH_NUM);

            if (count($array_same_pseudo) > 0) {
                $_SESSION['error_msg'] = "Vous n'avez pas été assez rapide !<br>Le pseudo " . $pseudo . " a été pris par quelqu'un d'autre, veuillez en choisir un autre.";
                header("Location: register.php");
                exit;
            }
            else {
                // Vérification du code
                if($code_sent == $code_good){
                    // Insertion des données utilisateur dans la base de données
                    $query2 = $connexion->prepare("INSERT INTO user_info (Prénom, Nom, Email, Pseudo, Mot_de_passe, Preference, Genre) VALUES (:firstname, :lastname, :email, :pseudo, :password, :preference, :gender)");
                    $query2->bindParam(':firstname', $firstname, PDO::PARAM_STR);
                    $query2->bindParam(':lastname', $lastname, PDO::PARAM_STR);
                    $query2->bindParam(':email', $email, PDO::PARAM_STR);
                    $query2->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
                    $query2->bindParam(':password', $password, PDO::PARAM_STR);
                    $query2->bindParam(':preference', $preference, PDO::PARAM_STR);
                    $query2->bindParam(':gender', $gender, PDO::PARAM_STR);
                    $query2->execute();
                    
                    // Redirection vers la page de connexion après inscription réussie
                    $_SESSION['error_msg'] = "Votre compte a été créé.<br>Veuillez vous connecter ci-dessous.";
                    header("Location: login.php");
                    exit;
                }
                else{
                    $_SESSION['error_msg'] = "Code entré incorrect.<br>Veuillez réessayer.";
                    header("Location: verif_register_enterMailCode.php");
                    exit;
                }
            }
        }
        catch (PDOException $e) {
            echo "Erreur de connexion : " . htmlspecialchars($e->getMessage());
        }
    }
    else {
        header("Location: register.php");
        exit;
    }
?>
