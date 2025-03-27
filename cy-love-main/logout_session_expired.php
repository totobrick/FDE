<?php
    session_start();
    session_unset(); //remove all session variables
    session_destroy(); //disconnect the user
    //print_r($_SESSION);

    session_start();
    $_SESSION['error_msg'] = "Votre session a expiré <i>(inactivité supérieure à 10 min)</i>.<br>Veuillez vous reconnecter.";
    header("Location: login.php");
    exit;
?>