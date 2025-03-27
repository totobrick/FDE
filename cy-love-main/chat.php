<?php
    session_start();
    include 'verifi-abonee.php';
    if ( !isset($_SESSION['ID_receiver']) || !isset($_SESSION['Pseudo_receiver']) ){
        $_SESSION['error_msg'] = "L'ID du destinataire (ID_receiver) n'a pas été récupérée.
                                <br>Veuillez choisir un destinataire.";
        header("Location: chat_history_contact.php");
        exit;
    }
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();

    //Variables
    $ID = $_SESSION['ID'];
    $Pseudo = htmlspecialchars($_SESSION['Pseudo']);
    //fuseau horaire
    date_default_timezone_set('Europe/Paris');
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
    <title>CY LOVE : chat</title>
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
            <section id="messages" style="display: block;"></section>
            <div class="write-message-container">
                <form id="form_msg" action="" method="post" enctype="multipart/form-data"> <!--envoie le formulaire à la page chat.php (d'où action="")-->
                    <div class="input-box-msg">
                        <label for="message"></label>
                        <textarea name="message" id="message" class="input-field-message" placeholder="Tapez votre message ici" required></textarea>
                        <i class="bx bx-envelope"></i>
                    </div>
                    <div class="input-box-send-msg">
                        <?php
                            if ( file_exists("Logos/logo_send_msg.svg") ){
                                echo "<input type=\"image\" name=\"submit-btn\" src=\"Logos/logo_send_msg.svg\" alt=\"Envoyer\" class=\"submit-message-btn\">";//<!--define an img as a submit button-->
                            }
                            else{
                                echo "<input type=\"submit\" name=\"submit-btn\" class=\"submit-message-btn\" value=\"Envoyer\">";
                            }
                        ?>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script>
        var firstload = true;
        loadMessages();
        var x = setInterval(loadMessages, 1000);  //refresh messages every 1000 milliseconds (1s)
        
        // Load messages
        function loadMessages() {
            $('#messages').load('Load_messages.php', function(){
                if(firstload){
                    scrollbarToBottom();
                    firstload = false;
                }
            });
        }

        // Scrollbar at the bottom of the gutter
        function scrollbarToBottom(){
            var container = document.querySelector("#messages");
            container.scrollTop = container.scrollHeight;
        }
</script>
<script>
    // Send Message
    $(document).ready(function(){
        $("#form_msg").on("submit", function(event){ //événement enclenché à la soumission du form (valable aussi pour les <input type='image' ...> qui sont des boutons submit)
            // prevent (empêche) page refresh
            event.preventDefault();

            // get datas of the form
            var formdata = $(this).serialize();
            formdata += '&submit-btn=submit';   //ajout d'info à formdata
                                                //(les données liées au bouton de soumission du formulaire ne sont pas transmises)

            // Envoie les données du formulaire en AJAX
            $.ajax({                            //requête asynchrone au serveur
                type: 'POST',
                url: 'chat_send_message.php',   //URL où on envoie la requête
                data: formdata,                 //données envoyées avec la requête
                success: function(response) {
                    //alert("Réponse :" + response);
                    document.getElementById('message').value = "";
                    loadMessages();
                    setTimeout(scrollbarToBottom, 300);// attend 300ms pour descendre scrollbar (on espère que les messages ont été récipérés au bout de 300ms)
                    scrollbarToBottom();
                    
                    // DEBUG affichage : $_SESSION['last_activity_time'] (variable qui déconnecte après un certain temps d'inactivité)
                    /*$('#account_icon_bar').load(window.location.href + ' #account_icon_bar > *');*/
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                    alert('Une erreur est survenue.');
                }
            });
        });
    });
    </script>
</body>
</html>