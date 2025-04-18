<?php
    session_start();
    if ( !isset($_SESSION['is_connected'])){
        echo "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        $_SESSION['error_msg'] = "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        header("Location: login.php");
        exit;
    }

    //génère un nouveau cache_buster
    $_SESSION['cache_buster'] = (int) (microtime(true) * 1000);
        /*  microtime(true) :   nbre de secondes écoulés depuis le 1er janvier 1970 (début de l'époque Unix)
                                c'est un float, contrairement à time
            (int) : rend entier le float
            BUT :   - rendre l'URL unique en ajoutant le nbre de millisecondes écoulés depuis le 1er janvier 1970.
                    - cela permet en JS (function loadPPimg()) de recharger l'image si elle a été changée
                        ce qui n'est pas possible si on ne met que $path_profile_picture car le navigateur a l'image en cache et ne fera pas le changement d'image
        */
    echo "cache_buster mis à jour";
?>