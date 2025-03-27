<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit;
    }

    if( isset($_POST['pseudo']) ){
        // Connexion à la base de données
        $servername = "localhost";
        $login = "root";
        $pass = "";
        $database = "cy_love_database";

        try {
            $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Vérification des données envoyées par le formulaire
            $Pseudo = $_POST['pseudo'];

            // Vérification de l'existence du pseudo et de l'email dans la base de données
            $query = $connexion->prepare("SELECT * FROM user_info WHERE BINARY Pseudo = :pseudo"); //BINARY : permet de tenir compte de la casse des caractères
            $query->bindParam(':pseudo', $Pseudo);
            $query->execute();
            //récupération: mot de passe et mail
            $response = $query->fetchall(PDO::FETCH_ASSOC);

            //Vérification de l'unicité du pseudo dans la base de données
            if ( count($response)==1 ){
                echo "<br>1 pseudo trouvé";
                if( isset($response[0]['ID']) && isset($response[0]['Pseudo']) && isset($response[0]['Mot_de_passe']) && isset($response[0]['Email']) ) {
                    $ID = $response[0]['ID'];
                    $mail = $response[0]['Email'];
                    $mot_de_passe = $response[0]['Mot_de_passe'];
                    $_SESSION['temp_ID'] = $ID;
                    $_SESSION['temp_Pseudo'] = $Pseudo;
                    $_SESSION['temp_MDP'] = $mot_de_passe;
                    $_SESSION['temp_Mail'] = $mail;
                    echo "<br>ID : " . $ID . "<br>Pseudo : " . $Pseudo . "<br>MDP : " . $mot_de_passe . "<br>mail: " . $mail;
                    header("Location: Mails/send_mail_forgot_pwd.php");
                    exit;
                }
                else {
                    echo "Mot de passe ou mail non trouvé pour le compte" . $Pseudo;
                    exit;
                }
            }
            elseif ( count($response)>=2 ){
                echo "<br> ERREUR GRAVE : plusieurs utilisateurs possèdent le même pseudo.";
                $_SESSION['error_msg'] = "ERREUR GRAVE : plusieurs utilisateurs possèdent le même pseudo.<br> Veuillez vous adresser à l'administrateur du site.";
                header("Location: forgot_pwd.php");
                exit;
            }
            else{
                echo "<br> Aucun utilisateur ne possède ce pseudo";
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
        $_SESSION['error_msg'] = "Aucun pseudo passé en paramètre.";
        header("Location: ../login.php");
        exit;
    }
?>