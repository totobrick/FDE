<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <style>
        #resultat{
            border: 2px solid green;
        }
        #test123{
            border: 2px solid blue;
        }
    </style>
    <title>CY Love : test</title>
</head>
<body>
    <form id="form-box">
        <input type="text" id="text" name="msg">
        <!--define an img as a submit button-->
        <input type="image" name="submit-btn" class="submit-message-btn" src="../Logos/logo_send_msg.svg" alt="Envoyer"  style="display: block; border: 1px solid black; background-color: grey; width: 25px; margin: 0;">
    </form>
    <div id="resultat"></div>
    <p id="test123"></p>

    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        $(document).ready(function(){
                $("#form-box").on("submit", function(event){ //événement enclenché à la soumission du form
                    // prevent (empêche) page refresh
                    event.preventDefault();

                    // get datas of the form
                    var formdata = $(this).serialize();
                    formdata += '&submit-btn=submit';   //ajout d'info à formdata
                                                        //(les données liées au bouton de soumission du formulaire ne sont pas transmises)

                    document.getElementById("resultat").innerHTML = "Les données : " + formdata;
                    document.getElementById("test123").innerHTML = "testB";

                    // Envoie les données du formulaire en AJAX
                    $.ajax({                            //requête asynchrone au serveur
                        type: 'POST',
                        url: 'chat_send_message.php',   //URL où on envoie la requête
                        data: formdata,                 //données envoyées avec la requête
                        success: function(response) {
                            alert("Réponse :" + response);
                            //document.getElementById("test123").innerHTML = <?php //echo $_SESSION['msg']; ?>;
                        },
                        error: function(xhr, status, error) {
                            console.error(xhr.responseText);
                            //console.error('Erreur: ' + error);
                            $('#resultat').html('Une erreur est survenue.');
                            alert('Une erreur est survenue.');
                        }
                    });
                });
            });
    </script>
    <?php
        echo "POST : ";
        print_r($_POST);
    ?>
</body>
</html>