<?php
    session_start();
    /*
    echo "<p color='white'>";
    echo "Session : ";
    print_r($_SESSION);
    echo "<br>POST : ";
    print_r($_POST);
    echo "</p>";
    exit;*/
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit();
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
            $gender = $_POST["gender"];
            $firstname = $_POST["Firstname"];
            $lastname = $_POST["Name"];
            $email = $_POST["Email"];
            $login = $_POST["Pseudo"];
            $password = $_POST["Password"];
            unset($_POST);

            /* Cas de redirection vers register.php (pour préremplir le formulaire) */
            $_SESSION["register_gender"] = $gender;
            $_SESSION["register_Firstname"] = $firstname;
            $_SESSION["register_Name"] = $lastname;
            $_SESSION["register_Email"] = $email;
            $_SESSION["register_Pseudo"] = $login;
            $_SESSION["register_Password"] = $password;

            // Get user ID
            $query = $connexion->prepare(
                "SELECT *
                FROM employees
                WHERE BINARY first_name = :first_name
                AND BINARY last_name = :last_name"
            ); //BINARY : permet de tenir compte de la casse des caractères
            $query->bindParam(':first_name', $firstname, PDO::PARAM_STR);
            $query->bindParam(':last_name', $firstname, PDO::PARAM_STR);
            $query->execute();
            $array = $query->fetchall(PDO::FETCH_ASSOC);

            // Vérification que la personne est un salarié (table : employees)
            if(count($array) == 0){
                $_SESSION['error_msg'] = $firstname . " " . $lastname . " n'est pas un salarié de FDE. Aucun compte ne peut être créé pour cette personne.";
                header("Location: register.php");
            }
            else if (count($array) > 1){
                $_SESSION['error_msg'] = "PROBLEME : plusieurs salariés se nomment : " . $firstname . " " . $lastname . ".";
                header("Location: register.php");
            }
            

            // Vérification du login unique
            $query1 = $connexion->prepare("SELECT ID FROM user_info WHERE BINARY login = :login"); //BINARY : permet de tenir compte de la casse des caractères
            $query1->bindParam(':login', $login, PDO::PARAM_STR);
            $query1->execute();
            $array_same_login = $query1->fetchAll(PDO::FETCH_NUM);

            if (count($array_same_login) > 0) {
                $_SESSION['error_msg'] = "Le login " . $login . " est déjà utilisé, veuillez en choisir un autre.";
                header("Location: register.php");
                exit;
            }
            else {
                //Envoi d'un mail avec un code à saisir
                header("Location: Mails/send_mail_verif_register.php");
                exit;

                // Insertion des données utilisateur dans la base de données
                /*
                $query2 = $connexion->prepare("INSERT INTO user_info (Prénom, Nom, Email, Pseudo, Mot_de_passe, Preference, Genre) VALUES (:firstname, :lastname, :email, :pseudo, :password, :preference, :gender)");
                $query2->bindParam(':firstname', $firstname, PDO::PARAM_STR);
                $query2->bindParam(':lastname', $lastname, PDO::PARAM_STR);
                $query2->bindParam(':email', $email, PDO::PARAM_STR);
                $query2->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
                $query2->bindParam(':password', $password, PDO::PARAM_STR);
                $query2->bindParam(':preference', $preference, PDO::PARAM_STR);
                $query2->bindParam(':gender', $gender, PDO::PARAM_STR);
                $query2->execute();
                */
                
                // Redirection vers la page de connexion après inscription réussie
                /*$_SESSION['error_msg'] = "Votre compte a été créé.<br>Veuillez vous connecter.";
                header("Location: login.php");
                exit;*/
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
