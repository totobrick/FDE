<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit;
    }

    if( isset($_POST['pseudo']) ){
        // Connexion à la base de données
        $servername = "localhost";
        $login_server = "root";
        $pass = "";
        $database = "FDE_database";

        try {
            $connexion = new PDO("mysql:host=$servername;dbname=$database", $login_server, $pass);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Vérification des données envoyées par le formulaire
            $login = $_POST['pseudo'];

            // Vérification de l'existence du pseudo et de l'email dans la base de données
            $query = $connexion->prepare("SELECT * FROM user_info WHERE BINARY login = :login"); //BINARY : permet de tenir compte de la casse des caractères
            $query->bindParam(':login', $login);
            $query->execute();
            //récupération: mot de passe et mail
            $response = $query->fetchall(PDO::FETCH_ASSOC);

            //Vérification de l'unicité du pseudo dans la base de données
            if ( count($response)==1 ){
                echo "<br>1 login trouvé";
                if( isset($response[0]['ID']) && isset($response[0]['login']) && isset($response[0]['password']) && isset($response[0]['mail']) ) {
                    $ID = $response[0]['ID'];
                    $mail = $response[0]['mail'];
                    $password = $response[0]['password'];
                    $_SESSION['temp_ID'] = $ID;
                    $_SESSION['temp_Login'] = $login;
                    $_SESSION['temp_Password'] = $password;
                    $_SESSION['temp_Mail'] = $mail;
                    echo "<br>ID : " . $ID . "<br>login : " . $login . "<br>MDP : " . $password . "<br>mail: " . $mail;
                    header("Location: Mails/send_mail_forgot_pwd.php");
                    exit;
                }
                else {
                    echo "Mot de passe ou mail non trouvé pour le compte" . $login;
                    exit;
                }
            }
            elseif ( count($response)>=2 ){
                echo "<br> ERREUR GRAVE : plusieurs utilisateurs possèdent le même login.";
                $_SESSION['error_msg'] = "ERREUR GRAVE : plusieurs utilisateurs possèdent le même login.<br> Veuillez vous adresser à l'administrateur du site.";
                header("Location: forgot_pwd.php");
                exit;
            }
            else{
                echo "<br> Aucun utilisateur ne possède ce login";
                $_SESSION['error_msg'] = "Aucun utilisateur ne possède ce pseudo.";
                header("Location: forgot_pwd.php");
                exit;
            }
        }
        catch(PDOException $e) {
            echo "Connexion impossible : " . $e->getMessage();
        }
    }
    else{
        $_SESSION['error_msg'] = "Aucun login passé en paramètre.";
        header("Location: ../login.php");
        exit;
    }
?>