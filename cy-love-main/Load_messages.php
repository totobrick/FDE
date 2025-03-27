<?php
    session_start();
    if ( !isset($_SESSION['is_connected']) || $_SESSION['is_connected'] != 'oui' || !isset($_SESSION['ID']) || !isset($_SESSION['Pseudo']) ){
        $_SESSION['error_msg'] = "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        header("Location: login.php");
        exit;
    }
    $ID = $_SESSION['ID'];
    $Pseudo = htmlspecialchars($_SESSION['Pseudo']); //htmlspecialchars : allow special characters as '<'
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
                WHERE (ID_user_sending = :ID AND ID_user_receiving = :ID_receiver) OR (ID_user_sending = :ID_receiver AND ID_user_receiving = :ID)
                ORDER BY ID_msg ASC");
        $query_history_messages->bindParam(':ID', $ID); //bind parameters
        $query_history_messages->bindParam(':ID_receiver', $ID_receiver);
        $query_history_messages->execute();
        $history_messages = $query_history_messages->fetchall(PDO::FETCH_ASSOC); //associative array with infos of every messages exchanged
        
        foreach($history_messages as $x){
            if($x['ID_user_sending']==$ID && $x['ID_user_receiving']==$ID_receiver){
                echo "
                    <div class=\"msg sending\"><p><b>" . $Pseudo . "</b></p>";
                if($x['Supprimé'] === "oui"){
                    echo "
                        <p class='removed_msg'>Message supprimé par un admin.</p>";
                }
                else{
                    echo "
                        <p>" . $x['Message'] . "</p>";
                }
                echo "
                        <p class='msg_date'>" . $x['Date'] . "</p>
                    </div>";
            }
            elseif($x['ID_user_sending']==$ID_receiver && $x['ID_user_receiving']==$ID){
                echo "
                    <div class=\"msg receiving\">
                        <p><b>" . $Pseudo_receiver . "</b></p>";
                if ($x['Supprimé'] === "oui"){
                    echo "
                        <p class='removed_msg'>Message supprimé par un admin.</p>";
                }
                else{
                    echo "
                        <p>" . $x['Message'] . "</p>";
                }
                echo "
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
?>