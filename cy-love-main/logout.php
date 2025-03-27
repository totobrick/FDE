<?php
    session_start();
    session_unset(); //remove all session variables
    session_destroy(); //disconnect the user
    //print_r($_SESSION);

    session_start();
    $_SESSION['error_msg'] = "Déconnexion réussie.";
    header("Location: login.php");
    exit;
?>