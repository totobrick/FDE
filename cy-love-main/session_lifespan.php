<?php
    session_start();
    // We will check if the session is expired or not

    if (!isset($_SESSION['last_activity_time'])){
        echo "logout_connection-time-not-found";
        session_unset();    //remove all session variables
        session_destroy();  //disconnect the user (+ remove all session variables)
        exit;
    }

    $inactive = 600;   /*  -> durée d'inactivité tollérée avant déconnexion
                            -> (en secondes)
                            -> ici 600s = 10 min
                        */
    /*print_r($_SESSION);
    echo "<br>";
    echo "<br> inactive = $inactive s<br>";
    echo $_SESSION['last_activity_time'];
    echo "<br>";
    echo time();*/
    $time_connected = time() - $_SESSION['last_activity_time'];
    if ($time_connected >= $inactive){
        echo "Session_expired";
        session_unset();    //remove all session variables
        session_destroy();  //disconnect the user (+ remove all session variables)
        exit;
    }
    else{
        echo "Stay connected.";
    }
?>