<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        header("Location: personal-account.php");
        exit;
    }
    elseif( !isset($_POST["submit"]) ){
        //someone not connected on this page ->redirection
        header('Location: login.php');
        exit;
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <script>
        var n = 4; // en secondes (n-1 secondes exécutées) //4
        var x = setInterval(countdown, 1000); //call countdown (without '()') function every 1000 milliseconds

        // Fonction compte à rebours (countdown)
        function countdown(){
            n--;
            document.querySelector("#countdown_redirection span").innerHTML = n;
            if(n <= 0){
                clearInterval(x);
                window.location.href = "index.php";
            }
        }
    </script>
    <link rel="stylesheet" href="Styles/style2.css">
    <title>FDE : Redirection</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')"> <!--Background image : https://img.freepik.com/photos-gratuite/jeune-couple-romantique-sexy-amoureux-heureux-plage-ete-ensemble-s-amusant-portant-maillots-bain-montrant-signe-du-coeur-sundet_285396-6545.jpg?t=st=1715103572~exp=1715107172~hmac=144c7e5b0ff875c6caeab703b9f2860b0da711ca04f6eb9e9186eb8b7e9f819d&w=2000-->
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <main>
            <div class="container" id="countdown_redirection">
                <?php
                    // Add account in cylove
                    $servername = "localhost";
                    $login_server = "root";
                    $pass = "";
                    $database = "FDE_database";

                    // Server connection test
                    try{
                        $connexion = new PDO("mysql:host=$servername;dbname=$database", $login_server, $pass);
                        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode
                        //echo "Connexion à la base de données réussie";

                        $login = $_POST["login"];
                        $Password =  $_POST["Password"];
                        if( strlen($Password)<=0 || strlen($login)<=0 ){
                            $_SESSION['error_msg'] = "Aucun champ ne doit être vide !";
                            header("Location: login.php");
                            exit;
                        }

                        // TEST if the login exists in database
                        $query_all_pseudos = $connexion->prepare("SELECT login FROM user_info");
                        $query_all_pseudos->execute();
                        $array_all_pseudos = $query_all_pseudos->fetchall(); // array with all pseudos in database
                        for ($i=0; $i<count($array_all_pseudos); $i++){
                            if ($login == $array_all_pseudos[$i][0]){
                                $query_pwd = $connexion->prepare(
                                    "SELECT password
                                    FROM user_info
                                    WHERE BINARY login = :login"
                                ); //BINARY : permet de tenir compte de la casse des caractères
                                //check the password
                                $query_pwd->bindParam(':login', $login);
                                $query_pwd->execute();
                                $result_pwd = $query_pwd->fetchall(); // array with the correct password

                                $_SESSION['login'] = $login;

                                // User is CONNECTED
                                if($Password == $result_pwd[0][0]){
                                    echo "  <div class=\"form-box_login\">
                                                <div class=\"login-container\" id=\"login\">
                                                    Bienvenue " . $login . "<br>
                                                    Mot de passe : " . $Password;

                                    // Get user ID
                                    $query = $connexion->prepare(
                                        "SELECT *
                                        FROM user_info
                                        WHERE BINARY login = :login"
                                    ); //BINARY : permet de tenir compte de la casse des caractères
                                    $query->bindParam(':login', $login);
                                    $query->execute();
                                    $array_all_infos = $query->fetchall(PDO::FETCH_ASSOC); // array with user ID

                                    //Variables to stay connected
                                    $_SESSION['ID'] = $array_all_infos[0]['ID'];
                                    $ID = $_SESSION['ID'];
                                    $_SESSION['is_connected'] = 'oui';
                                    $_SESSION['admin'] = $array_all_infos[0]['admin'];
                                    $_SESSION['last_activity_time'] = time();
                                        /*  -> time() : nbre de secondes écoulées depuis le 1er janvier 1970
                                            -> ici on enregistre le moment de connection pour pouvoir faire une déconnection automatique
                                            après un certain temps d'inactivité (logout_auto_disconnection.php)
                                        */

                                    echo "      <br>Connexion réussie.
                                                <br>Redirection dans <span></span> seconde(s).
                                            </div>
                                        </div>";
                                    exit;
                                }
                                else {
                                    header("Location: login.php");
                                    exit;
                                }
                            }
                        }
                        $_SESSION['error_msg'] = "Pseudo inexistant !";
                        header("Location: login.php");
                        exit;
                    }

                    catch (PDOException $e){
                        echo "Connexion impossible : " . $e->getMessage();
                    }
                ?>
            </div>
        </main>
    </div>
</body>
</html>
