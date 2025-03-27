<?php
    session_start();
    include 'verifi-abonee.php'; // vérifie si abonné OU si admin (un admin a tous les droits)
    if ( !isset($_SESSION['ID_receiver']) || !isset($_SESSION['Pseudo_receiver']) ){
        $_SESSION['error_msg'] = "L'ID du destinataire (ID_receiver) ou son pseudo (Pseudo_receiver) n'a pas été récupérée.";
        header("Location: admin_see_chat_history.php");
        exit;
    }
    if ( !isset($_SESSION['ID_observed']) || !isset($_SESSION['Pseudo_observed']) ){
        $_SESSION['error_msg'] = "L'ID du destinataire (ID_observed) ou son pseudo (Pseudo_observed) n'a pas été récupérée.
                                <br>Veuillez choisir un destinataire.";
        header("Location: admin_see_chat_history.php");
        exit;
    }
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();

    //Variables
    $ID_observed = $_SESSION['ID_observed'];
    $Pseudo_observed = htmlspecialchars($_SESSION['Pseudo_observed']);
    //fuseau horaire
    date_default_timezone_set('Europe/Paris');
?>

<?php
    $servername = "localhost";
    $login = "root";
    $pass = "";

    // Connexion à la base de données
    try {
        $connexion = new PDO("mysql:host=$servername;dbname=cy_love_database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch (PDOException $e) {
        echo "Connexion impossible à la base de données: " . htmlspecialchars($e->getMessage());
        exit;
    }
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style7_chat.css">
    <!--Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
            -> session_lifespan.js ne fonctionne pas sans
            -> le script en bas de page ne fonctionne pas sans
    -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="session_lifespan.js"></script>
    <title>CY LOVE : Admin chat</title>
</head>
<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <?php include 'account_icon_bar.php'?>
        <div class="chat-area">
            <div class="top-chat-area">
                <div class="recipient">
                    <?php
                        $ID_recipient = $_SESSION['ID_receiver'];
                        $Pseudo_recipient = $_SESSION['Pseudo_receiver'];

                        $path_recipient_profile_picture = "Accounts/ID_" . $ID_recipient . "/profile_picture/profile_picture_ID_" . $ID_recipient . ".jpg";
                        if(!file_exists($path_recipient_profile_picture)){
                            $path_recipient_profile_picture = "Logos/profile_picture.svg";
                            echo "  <div class=\"profile-picture vertical-img\">
                                        <img src=$path_recipient_profile_picture alt=\"IMG\">
                                    </div>";
                        }
                        else{
                            list($width, $height, $type, $attr) = getimagesize($path_recipient_profile_picture);
                            if($height >= $width){
                                echo "  <div class=\"profile-picture vertical-img\">";
                            }
                            else{
                                echo "  <div class=\"profile-picture horizontal-img\">";
                            }
                            echo "          <img src=$path_recipient_profile_picture>
                                        </div>";
                        }
                    ?>
                    <p><?php echo $Pseudo_recipient;?></p>
                </div>
                <div class="top-chat-area-right">
                    <?php
                        if(isset($_SESSION['error_msg'])){
                            echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                        }
                        unset($_SESSION['error_msg']); // remove only this session variable
                    ?>
                </div>
            </div>
            <section id="messages-observed" style="display: block;"></section>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script>
        //charge les messages
        loadMessages();
        setTimeout(scrollbarToBottom, 300);// attend 300ms pour descendre scrollbar (on espère que les messages ont été récipérés au bout de 300ms)
        
        var x = setInterval(loadMessages, 5000); //refresh messages every 5000 milliseconds (5s)
        function loadMessages() {
            $('#messages-observed').load('admin_see_Load_messages.php');
        }

        // Scrollbar at the bottom of the gutter
        function scrollbarToBottom(){
            var container = document.querySelector("#messages-observed");
            container.scrollTop = container.scrollHeight;
        }
    </script>
</body>
</html>