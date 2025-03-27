<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
        $_SESSION['last_activity_time'] = time();
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/service_style.css">
    <?php
        /*  Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
                -> session_lifespan.js ne fonctionne pas sans*/
        if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
            echo "  <script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>
                    <script src=\"session_lifespan.js\"></script>";
        }
    ?>
    <title>CY LOVE : Abonnement</title>
</head>
<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <?php
            if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
                include 'account_icon_bar.php';
            }
        ?>
        <div class="subscription-area">
            <div class="top">
                <?php
                    if( isset($_SESSION['error_msg']) || ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ) ){
                        echo "<div class='top-info'>";
                        if( isset($_SESSION['error_msg']) ){
                            echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                            unset($_SESSION['error_msg']); // remove only this session variable
                        }
                        if( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
                            $servername = "localhost";
                            $login = "root";
                            $pass = "";
                            $database = "cy_love_database";
                            //server connexion test
                            try{
                                $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
                                $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode

                                //vérifie si utilisateur est abonné
                                $query = $connexion->prepare("
                                        SELECT Abonnement FROM user_info
                                        WHERE ID = :ID");
                                $query->bindParam(':ID', $_SESSION['ID']);
                                $query->execute();
                                $result = $query->fetchColumn(); //récupère seulement la valeur, pas un tableau
                                if( $result==='OUI'){
                                    echo "<p>Vous êtes déjà abonné(e).</p>";
                                }
                                else{
                                    echo "<p>Vous n'êtes pas encore abonné(e).<br><i>Abonnez-vous pour chatter avec d'autres utilisateurs</i></p>";
                                }
                            }
                            catch (PDOException $e){
                                echo "Connexion impossible à la base de données: " . $e->getMessage();
                                exit;
                            }
                        }
                        echo "</div>";
                    }
                ?>
            </div>
            <div class="subscription-infos">
                <div class="free-block" id="free-block">
                    <div class="top-free-block">
                        <p>GRATUIT</p>
                    </div>
                    <div class="free-block-content">
                        <div class="text-free-block">
                            <table>
                                <tr>
                                    <td>✅ Voir 10 profils</td>
                                </tr>
                                <tr>
                                    <td>✅ Messagerie</td>
                                </tr>
                                <tr>
                                    <td>&#x274C; Accès au chat</td>
                                </tr>
                                <tr>
                                    <td>&#x274C; Recherche de profils</td>
                                </tr>
                                <tr>
                                    <td>&#x274C; Espace Administrateur</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <form action="update_subscription.php" method="post">
                        <input type="hidden" name="action" value="unsubscribe">
                        <button type="submit" id="free-block-btn" class="free-block-btn"> <span class="emoji">&#128128;&nbsp;</span> Se désabonner <span class="emoji">&nbsp;&#128128;</span> </button>
                    </form>
                </div>

                <div class="sub-block" id="sub-block">
                    <div class="top-sub-block">
                        <p>PREMIUM</p>
                    </div>
                    <div class="sub-block-content">
                        <div class="text-sub-block">
                            <table>
                                <tr>
                                    <td>✅ Voir 10 profils</td>
                                </tr>
                                <tr>
                                    <td>✅ Messagerie</td>
                                </tr>
                                <tr>
                                    <td>✅ Accès au chat</td>
                                </tr>
                                <tr>
                                    <td>✅ Recherche de profils</td>
                                </tr>
                                <tr>
                                    <td>&#x274C; Espace Administrateur</td>
                                </tr>
                </table>
                        </div>
                    </div>
                    <form action="update_subscription.php" method="post">
                        <input type="hidden" name="action" value="subscribe">
                        <button type="submit" class="sub-block-btn" id="sub-block-btn"> <span class="emoji">&#128571;&nbsp;</span> Je m'abonne ! <span class="emoji">&nbsp;&#128571;</span> </button>
                    </form>
                </div>
                </div>
            </div>
        </div>
</body>
</html>
