
<?php
    session_start();
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit-btn'])) {
        $servername = "localhost";
        $login = "root";
        $pass = "";
        $database = "cy_love_database";

        // Connexion à la base de données
        try {
            $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
            $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Envoyer un message
            if(isset($_POST['Pseudo_receiver'])){ // Cas pour une 1ere écriture à un nouveau contact
                $_SESSION['Pseudo_receiver'] = $_POST['Pseudo_receiver'];
            }
            if(!empty($_SESSION['Pseudo_receiver']) ){ //&& !empty($_POST['message'])
                $Pseudo_receiver = $_SESSION['Pseudo_receiver'];
                $query_receiver = $connexion->prepare("SELECT Pseudo, ID FROM user_info WHERE BINARY Pseudo = :pseudo"); //BINARY rend la comparaison sensible à la casse
                $query_receiver->bindParam(':pseudo', $Pseudo_receiver, PDO::PARAM_STR);
                $query_receiver->execute();
                $Infos_receiver = $query_receiver->fetchAll(PDO::FETCH_NUM);

                // Vérification : a-t-on trouvé 1 seule personne avec ce Pseudo?
                if(count($Infos_receiver) == 0){
                    $_SESSION["error_msg"] = "Le pseudo " . $Pseudo_receiver . " n'existe pas.";
                    header("Location: chat_history_contact.php");
                    exit;
                }
                elseif(count($Infos_receiver) >= 2){
                    $_SESSION["error_msg"] = "ERREUR anormale : le pseudo " . $Pseudo_receiver . " existe au moins 2 fois dans la base de données. Aucun message n'a été envoyé.";
                    header("Location: chat_history_contact.php");
                    exit;
                }
                
                // Le pseudo existe: ENVOYER MESSAGE (s'il existe)
                else {
                    $ID = $_SESSION['ID'];
                    $ID_receiver = $Infos_receiver[0][1];
                    $_SESSION['ID_receiver'] = $ID_receiver;
                    if( isset($_POST['message']) && !empty($_POST['message']) ){
                        $message = nl2br($_POST['message']);        //nl2br : transform \n in <br>
                        $current_datetime = date('Y-m-d H:i:s');    //get actual date and time
                        $query_message = $connexion->prepare("INSERT INTO messages (ID_user_sending, ID_user_receiving, Message, Date) VALUES (:id_user_sending, :id_user_receiving, :message, :current_datetime)");
                        $query_message->bindParam(':id_user_sending', $ID);
                        $query_message->bindParam(':id_user_receiving', $ID_receiver);
                        $query_message->bindParam(':message', $message);
                        $query_message->bindParam(':current_datetime', $current_datetime);
                        $query_message->execute();
                        
                        echo "\nMessage envoyé";
                        unset($_POST);
                        unset($message);
                        //header("Location: chat.php");
                        exit;
                    }
                    elseif( !isset($_POST['message']) ){
                        echo "\nAucun message transmis.";
                        $_SESSION["error_msg"] = "Veuillez écrire un message.";
                        header("Location: chat.php");
                        exit;
                        //do nothing
                        //La personne vient de se connecter à un nouveau contact, lorqu'elle arrive sur la page, elle n'a pas pu écrire de message
                    }
                    else{
                        $_SESSION["error_msg"] = "ERREUR : Vous ne pouvez pas envoyer de message vide.";
                        header("Location: chat_history_contact.php");
                        exit;
                    }
                }
            }
            else {
                $_SESSION["error_msg"] = "ERREUR : Le pseudo est vide";
                header("Location: chat_history_contact.php");
                exit;
            }
            
        }
        catch (PDOException $e) {
            echo "Connexion impossible à la base de données: " . htmlspecialchars($e->getMessage());
            exit;
        }
    }
    else{
        echo "\nErreur survenue lors de l'envoi du formuaire de message.";
        $_SESSION['error_msg'] = "Erreur survenue lors de l'envoi du formulaire de message.";
        header("Location: chat_history_contact.php");
        exit;
    }
?>