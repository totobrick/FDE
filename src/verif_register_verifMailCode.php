<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit();
    }
    if (!isset($_POST["Code"])){
        $_SESSION['error_msg'] = "Vous n'avez entré aucun code.";
        header("Location: verif_register_enterMailCode.php");
        exit;
    }
    if ( !isset($_SESSION["Code"]) || !isset($_SESSION["register_gender"]) || !isset($_SESSION["register_Firstname"]) || !isset($_SESSION["register_Password"]) || !isset($_SESSION["register_Email"]) || !isset($_SESSION["register_Pseudo"]) || !isset($_SESSION["register_Password"]) ){
        $_SESSION['error_msg'] = "Tout ou partie de vos informations personnelles ne sont plus dans des variables de session (page: verif_register_verifMailCode.php).";
        header("Location: register.php");
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $servername = "localhost";
        $login_server = "root";
        $pass = "";
        $dbname = "FDE_database";

        try {
            $connexion = new PDO("mysql:host=$servername;dbname=$dbname", $login_server, $pass);
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
            $login = $_SESSION["register_Pseudo"];
            $password = $_SESSION["register_Password"];
            

            /* -------------- VERIFICATIONS --------------
                On refait les vérifications déjà effectuées (login unique) car la base de données
                a pu changer depuis l'exécution de verif_register.php.
                (ex : le login était unique tout à l'heure, mais si la personne met longtemps à mettre le code de
                vérification reçu par mail, qq1 d'autre a pu s'inscrire en même temps avec le même login entre temps)
            */
            // Vérification du login unique
            $query1 = $connexion->prepare("SELECT ID FROM user_info WHERE BINARY login = :login"); //BINARY : permet de tenir compte de la casse des caractères
            $query1->bindParam(':login', $login, PDO::PARAM_STR);
            $query1->execute();
            $array_same_login = $query1->fetchAll(PDO::FETCH_NUM);

            if (count($array_same_login) > 0) {
                $_SESSION['error_msg'] = "Vous n'avez pas été assez rapide !<br>Le pseudo " . $login . " a été pris par quelqu'un d'autre, veuillez en choisir un autre.";
                header("Location: register.php");
                exit;
            }
            else {
                // Vérification du code
                if($code_sent == $code_good){
                    // Insertion des données utilisateur dans la base de données
                    $query2 = $connexion->prepare("INSERT INTO user_info (first_name, last_name, mail, login, password, gender) VALUES (:firstname, :lastname, :email, :login, :password, :gender)");
                    $query2->bindParam(':firstname', $firstname, PDO::PARAM_STR);
                    $query2->bindParam(':lastname', $lastname, PDO::PARAM_STR);
                    $query2->bindParam(':email', $email, PDO::PARAM_STR);
                    $query2->bindParam(':login', $login, PDO::PARAM_STR);
                    $query2->bindParam(':password', $password, PDO::PARAM_STR);
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
