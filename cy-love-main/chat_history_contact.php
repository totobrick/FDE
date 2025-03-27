<?php
    session_start();
    if ( !isset($_SESSION['is_connected']) || $_SESSION['is_connected'] != 'oui' || !isset($_SESSION['ID']) || !isset($_SESSION['Pseudo']) ){
        $_SESSION['error_msg'] = "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        header("Location: login.php");
        exit;
    }
    unset($_SESSION['ID_receiver']);
    unset($_SESSION['Pseudo_receiver']);
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();

    //Variables
    $ID = $_SESSION['ID'];
    $Pseudo = htmlspecialchars($_SESSION['Pseudo']); //htmlspecialchars : allow special characters as '<'
    //fuseau horaire
    date_default_timezone_set("Europe/Paris");
    //echo date("H:i:s d/m/Y");
?>


<?php
    $servername = "localhost";
    $login = "root";
    $pass = "";

    //server connexion test
    try{
        $connexion = new PDO("mysql:host=$servername;dbname=cy_love_database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode

        /*  Récupère tous les IDs des personnes qui ont envoyé
            ou reçu de l'utilisateur un message dans l'ordre
            anti-chronologique (avec ID_msg DESC)*/
        $query = $connexion->prepare("
                SELECT * FROM messages
                WHERE (ID_user_sending = :ID) OR (ID_user_receiving = :ID)
                ORDER BY ID_msg DESC");
        $query->bindParam(':ID', $ID);
        $query->execute();
        $history_all_messages = $query->fetchall(PDO::FETCH_ASSOC); //associative array with infos of all messages exchanged with user ID (sorted by ID DESC)
        
        // Garde seulement le dernier message échangé avec chaque utilisateur
        $last_message = array();
        for($i=0; $i<count($history_all_messages); $i++){
            if( $history_all_messages[$i]['ID_user_sending'] == $ID ){
                $contact_ID = $history_all_messages[$i]['ID_user_receiving']; //potentiel nouveau contact à insérer
            }
            elseif( $history_all_messages[$i]['ID_user_receiving'] == $ID ){
                $contact_ID = $history_all_messages[$i]['ID_user_sending'];
            }
            else{
                $_SESSION['error_msg'] = "Impossible de charger les messages.<br>ERREUR n°1 : des messages ne vous incluant pas ont été récupérés.";
                header("Location: personal-acount.php");
                exit;
            }
            //vérifie si l'ID du contact est déjà dans $contact_ID.
            //S'il y est, on a déjà un message plus récent échangé entre ID et le contact.
            $push = 1;
            for($j=0; $j<count($last_message); $j++){
                $push = 1;
                if( $contact_ID == $last_message[$j]['ID_user_sending'] || $contact_ID == $last_message[$j]['ID_user_receiving'] ){
                    $push = 0;
                    break;
                }
            }
            
            if($push == 1){
                array_push($last_message, $history_all_messages[$i]);
            }
        }
    }
    catch (PDOException $e){
        echo "Connexion impossible à la base de données: " . $e->getMessage();
        exit;
    }
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style6_chat_history_contact.css">
    <!--Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
            -> session_lifespan.js ne fonctionne pas sans 
            -> le script en bas de page ne fonctionne pas sans
    -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="session_lifespan.js"></script>
    <title>CY Love : messagerie</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')"> <!--Background image : https://img.freepik.com/photos-gratuite/jeune-couple-romantique-sexy-amoureux-heureux-plage-ete-ensemble-s-amusant-portant-maillots-bain-montrant-signe-du-coeur-sundet_285396-6545.jpg?t=st=1715103572~exp=1715107172~hmac=144c7e5b0ff875c6caeab703b9f2860b0da711ca04f6eb9e9186eb8b7e9f819d&w=2000-->
    <div class="wrapper">
        <?php include 'header.php'?>
        <?php include 'account_icon_bar.php'?>

        <div class="contact-box">
            <?php
                if(isset($_SESSION['error_msg'])){
                    echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                }
                unset($_SESSION['error_msg']); // remove only this session variable
            ?>
            <!-- Search a new contact -->
            <a class="search_new_contact_btn" href="search.php">
                <img src="Logos/logo_search.svg" alt="search_img">
                <p>Rechercher un destinataire</p>
            </a>
            
            <!-- old version -->
            <!--
            <div class="new-contact-container">
                <form action="chat_send_message.php" method="post" enctype="multipart/form-data">
                    <div class="input-box-search-field">
                        <label for="Pseudo_receiver"></label>
                        <input type="text" name="Pseudo_receiver" class="input-field-message" placeholder="Rechercher un destinataire" required>
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box-search-btn">
                        <input type="submit" name="submit-btn" class="submit-message" value="Rechercher">
                    </div>
                </form>
            </div>
            -->

            <!-- Show old discussions with known contacts -->
            <div class="history_contacts">
                <?php
                    if(count($last_message)==0){
                        echo "Vous n'avez eu aucune discussion.";
                    }
                    for($i=0; $i<count($last_message) ;$i++){
                        //Récupère infos dans variables : $ID_contact, $pseudo_contact, $image_contact, $msg
                        if( $last_message[$i]['ID_user_sending'] == $ID ){
                            $ID_contact = $last_message[$i]['ID_user_receiving'];
                            $sender = "Moi";
                        }
                        elseif( $last_message[$i]['ID_user_receiving'] == $ID ){
                            $ID_contact = $last_message[$i]['ID_user_sending'];
                            $sender = "Reçu";
                        }
                        else{
                            $_SESSION['error_msg'] = "Impossible de charger les messages.<br>ERREUR n°2 : des messages ne vous incluant pas ont été récupérés.";
                            header("Location: personal-acount.php");
                            exit;
                        }
                        $query_pseudo_contact = $connexion->prepare("
                                SELECT Pseudo FROM user_info
                                WHERE ID = :ID");
                        $query_pseudo_contact->bindParam(':ID', $ID_contact);
                        $query_pseudo_contact->execute();
                        $pseudo_contact = $query_pseudo_contact->fetchColumn(); //récupère seulement la valeur, pas un tableau
                
                        $image_contact = "Accounts/ID_" . $ID_contact . "/profile_picture/profile_picture_ID_" . $ID_contact . ".jpg";
                        $msg = $last_message[$i]['Message'];
                        $date = $last_message[$i]['Date'];

                        // Affichage du contact
                        echo "<div class=\"chat_contact\" data-id=\"" . $ID_contact . "\">
                                <div class=\"info_contact\">";

                                    $path_contact_profile_picture = "Accounts/ID_" . $ID_contact . "/profile_picture/profile_picture_ID_" . $ID_contact . ".jpg";
                                    if(!file_exists($path_contact_profile_picture)){
                                        $path_contact_profile_picture = "Logos/profile_picture.svg";
                                        echo "  <div class=\"profile_picture_contact vertical-img\">
                                                    <img src=$path_contact_profile_picture alt=\"IMG\">
                                                </div>";
                                    }
                                    else{
                                        list($width, $height, $type, $attr) = getimagesize($path_contact_profile_picture);
                                        if($height >= $width){
                                            echo "  <div class=\"profile_picture_contact vertical-img\">";
                                        }
                                        else{
                                            echo "  <div class=\"profile_picture_contact horizontal-img\">";
                                        }
                                        echo "          <img src=$path_contact_profile_picture>
                                                    </div>";
                                    }
                                    echo "
                                    <span class=\"pseudo\">" . htmlspecialchars_decode($pseudo_contact) . "</span>
                                    <span class=\"time\">" . $date ."</span>
                                </div>
                                <div class=\"last_message\">
                                    <span class=\"sender\">" . htmlspecialchars_decode($sender) . " : </span>
                                    <span class=\"message\">" . htmlspecialchars_decode($msg) . "</span>
                                </div>
                            </div>";
                    }
                ?>
            <div>
        </div>
    </div>
    <script>
        $(document).ready(function() {          //exécuté quand le doc est entièrement chargé
            $('.chat_contact').click(function() {   //get the click
                var contactID = $(this).data('id'); //get contactID
                $.ajax({                            //requête asynchrone au serveur
                    type: 'POST',
                    url: 'store_contact_id.php', //URL où on envoie la requête
                    data: { contact_id: contactID }, //données envoyées avec la requête
                    success: function(response) {
                        console.log(response);      //show response into the console
                        window.location.href = "chat.php";
                    },
                    error: function(xhr, status, error) {
                        console.error(xhr.responseText);
                    }
                });
            });
        });
    </script>
</body>
</html>