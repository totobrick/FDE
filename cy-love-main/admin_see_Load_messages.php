<?php
    session_start();
    if ( !isset($_SESSION['is_connected']) || $_SESSION['is_connected'] != 'oui' || !isset($_SESSION['ID']) || !isset($_SESSION['Pseudo']) ){
        $_SESSION['error_msg'] = "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        header("Location: login.php");
        exit;
    }
    $ID_observed = $_SESSION['ID_observed'];
    $Pseudo_observed = htmlspecialchars($_SESSION['Pseudo_observed']); //htmlspecialchars : allow special characters as '<'
    $ID_receiver = $_SESSION['ID_receiver'];
    $Pseudo_receiver = $_SESSION['Pseudo_receiver'];
    
    $servername = "localhost";
    $login = "root";
    $pass = "";

    try{
        $connexion = new PDO("mysql:host=$servername;dbname=cy_love_database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode

        $query_history_messages = $connexion->prepare("
                SELECT * FROM messages
                WHERE (ID_user_sending = :ID_observed AND ID_user_receiving = :ID_receiver) OR (ID_user_sending = :ID_receiver AND ID_user_receiving = :ID_observed)
                ORDER BY ID_msg ASC");
        $query_history_messages->bindParam(':ID_observed', $ID_observed); //bind parameters
        $query_history_messages->bindParam(':ID_receiver', $ID_receiver);
        $query_history_messages->execute();
        $history_messages = $query_history_messages->fetchall(PDO::FETCH_ASSOC); //associative array with infos of every messages exchanged

        if(isset($_SESSION['error_msg'])){
            echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
        }
        //unset($_SESSION['error_msg']); // remove only this session variable

        foreach($history_messages as $x){
            if($x['ID_user_sending']==$ID_observed && $x['ID_user_receiving']==$ID_receiver){
                echo "
                    <div class=\"msg sending\" data-id=\"" . $x['ID_msg'] . "\">
                        <p><b>" . $Pseudo_observed . "</b></p>";
                if($x['Supprimé'] === "oui"){
                    echo "
                        <div class=\"give_back_msg\">
                            <div class=\"green_check\">
                                <div class=\"green_check_contain\">
                                    <div class=\"bar1\"></div>
                                    <div class=\"bar2\"></div>
                                </div>
                            </div>
                            <span>Rendre l'accès au message</span>
                        </div>
                        <p class='removed_msg'>Message supprimé par un admin.</p>";
                }
                else{
                    echo "
                        <div class=\"delete_msg\">
                            <div class=\"red_cross\">
                                <div class=\"bar1\"></div>
                                <div class=\"bar2\"></div>
                            </div>
                            <span>Supprimer le message</span>
                        </div>";
                }
                echo "
                        <p>" . $x['Message'] . "</p>
                        <p class='msg_date'>" . $x['Date'] . "</p>
                    </div>";
            }
            elseif($x['ID_user_sending']==$ID_receiver && $x['ID_user_receiving']==$ID_observed){
                echo "
                    <div class=\"msg receiving\" data-id=\"" . $x['ID_msg'] . "\">
                        <p><b>" . $Pseudo_receiver . "</b></p>";
                if($x['Supprimé'] === "oui"){
                    echo "
                        <div class=\"give_back_msg\">
                            <span>Rendre l'accès au message</span>
                            <div class=\"green_check\">
                                <div class=\"green_check_contain\">
                                    <div class=\"bar1\"></div>
                                    <div class=\"bar2\"></div>
                                </div>
                            </div>
                        </div>
                        <p class='removed_msg'>Message supprimé par un admin.</p>";
                }
                else{
                    echo "
                        <div class=\"delete_msg\">
                            <span>Supprimer le message</span>
                            <div class=\"red_cross\">
                                <div class=\"bar1\"></div>
                                <div class=\"bar2\"></div>
                            </div>
                        </div>";
                }
                echo "
                        <p>" . $x['Message'] . "</p>
                        <p class='msg_date'>" . $x['Date'] . "</p>
                    </div>";
            }
            else{
                echo "<p style='color: red; font-weight: bold;'>Problème de message: ERREUR n°106.</p>";
            }
        }
    }
    catch (PDOException $e){
        echo "Connexion impossible à la base de données: " . $e->getMessage();
        exit;
    }


    //$_SESSION['error_msg'] = 'grand testa.';
    unset($_SESSION['error_msg']);
?>



<script>
    //suppression de message
    $('.delete_msg').click(function() {         //get the click
        var id_msg_to_delete = $(this).parent().data('id'); //récupère ID du msg à supprimer depuis data-id (dans l'élément parent)
        $.ajax({                                //requête asynchrone au serveur
            type: 'POST',
            url: 'admin_delete_msg.php',        //URL où on envoie la requête
            data: { ID_msg: id_msg_to_delete }, //données envoyées avec la requête
            dataType: 'json',                   // Attend une réponse JSON
            success: function(response) {       //est appelé quand le serveur répond avec succès à la requête AJAX => response contient la réponse du serveur
                if (response.success) {
                    $('#error_msg').text(response.message).show(); //affiche message de succès
                    loadMessages();  //recharge les messages après suppression
                }
                else {
                    $('#error_msg').text(response.message).show(); //affiche message d'erreur
                }
                //console.log(response);        //show response into the console
                
                // DEBUG affichage : $_SESSION['last_activity_time'] (variable qui déconnecte après un certain temps d'inactivité)
                /*$('#account_icon_bar').load(window.location.href + ' #account_icon_bar > *');*/
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                $('#error_msg').text("Une erreur s'est produite. Veuillez réessayer.").show(); //affiche une erreur générique en cas de problème
            }
        });
    });

    //Message de nouveau accessible
    $('.give_back_msg').click(function() {      //get the click
        var id_msg_to_give_back = $(this).parent().data('id'); //récupère ID du msg à supprimer depuis data-id (dans l'élément parent)
        $.ajax({                                //requête asynchrone au serveur
            type: 'POST',
            url: 'admin_give_back_msg.php',
            data: { ID_msg: id_msg_to_give_back },
            dataType: 'json',                   // Attend une réponse JSON
            success: function(response) {
                if (response.success) {
                    $('#error_msg').text(response.message).show();  //affiche message de succès
                    loadMessages();                                 //recharge les messages après suppression
                }
                else {
                    $('#error_msg').text(response.message).show(); //affiche message d'erreur
                }
                //console.log(response);

                // DEBUG affichage : $_SESSION['last_activity_time'] (variable qui déconnecte après un certain temps d'inactivité)
                /*$('#account_icon_bar').load(window.location.href + ' #account_icon_bar > *');*/
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                $('#error_msg').text("Une erreur s'est produite. Veuillez réessayer.").show();
            }
        });
    });
</script>