<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
        $_SESSION['last_activity_time'] = time();

        //Variables$ID = $_SESSION['ID'];
        $Pseudo = $_SESSION['Pseudo'];
        
        //session open
        //do nothing
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style8_search.css">
    <?php
        /*  Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
                -> session_lifespan.js ne fonctionne pas sans*/
        if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
            echo "  <script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>
                    <script src=\"session_lifespan.js\"></script>";
        }
    ?>
    <title>CY LOVE : 10 profils</title>
</head>
<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <?php
            if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
                include 'account_icon_bar.php';
            }
        ?>
        
        <div class="profiles-block">
            <div class="form_search">
                <div class="top">
                    <header>Liste des 10 premiers profils</header>
                    <?php
                        if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
                            echo "  <span>
                                        Pour voir plus de comptes, cliquez <a href=\"search.php\">ici</a>.<br>
                                        Si vous n'êtes pas bonné(e), vous pouvez souscrire à l'abonnement en cliquant <a href=\"service.php\">ici</a>.
                                    </span>";
                        }
                        else {
                            echo "  <span>
                                        Pour voir plus de comptes, vous devez avoir un compte et être abonné(e).<br>
                                        Pour créer un compte, cliquez <a href=\"register.php\">ici</a>
                                    </span>";
                        }
                    ?>
                </div>
            </div>
            <?php
                // Connexion à la base de données
                $servername = "localhost";
                $username = "root";
                $password = "";
                $database = "cy_love_database";

                echo "<div class=\"profiles-list\">";

                try {
                    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
                    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                    // Requête SQL pour récupérer les 10 premiers profils
                    $sql = "    SELECT * FROM user_info
                                ORDER BY ID ASC
                                LIMIT 10";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute();
                    $array_info_accounts = $stmt->fetchall(PDO::FETCH_ASSOC);  //associative array

                    // Vérifier s'il y a des résultats
                    if ( count($array_info_accounts) > 0) {
                        // Affichage des profils correspondants
                        for ($i=0; $i<count($array_info_accounts); $i++) {
                            // Affichage des profils
                            echo "
                                <div class='profile-box'>
                                    <div class='profile-container'>
                                        <div class='profile-pseudo'>" . htmlspecialchars($array_info_accounts[$i]["Pseudo"]) . "
                                        </div>
                            ";

                            // Afficher la photo si elle existe
                            $path_contact_profile_picture = htmlspecialchars($array_info_accounts[$i]["Photo_de_profil"]);
                            if(!file_exists($path_contact_profile_picture)){
                                $path_contact_profile_picture = "Logos/profile_picture.svg";
                                echo "  <div class=\"profile-picture vertical-img\">
                                            <img src=$path_contact_profile_picture alt=\"IMG\">
                                        </div>";
                            }
                            else {
                                list($width, $height, $type, $attr) = getimagesize($path_contact_profile_picture);
                                if($height >= $width){
                                    echo "  <div class=\"profile-picture vertical-img\">";
                                }
                                else{
                                    echo "  <div class=\"profile-picture horizontal-img\">";
                                }
                                echo "          <img src=$path_contact_profile_picture>
                                            </div>";
                            }
                            echo "
                                <div class='profile-infos'>
                                    <table class='profile-table'>
                                        <tr>
                                            <td class='col1'>Sexe&ensp;: </td>
                                            <td class='col2'>";
                                            if( ($array_info_accounts[$i]["Genre"])!=NULL ){
                                                echo htmlspecialchars($array_info_accounts[$i]["Genre"]);
                                            }
                                            echo "</td>
                                        </tr>
                                        <tr>
                                            <td class='col1'>Profession&ensp;: </td>
                                            <td class='col2'>";
                                            if( ($array_info_accounts[$i]["Profession"])!=NULL ){
                                                echo htmlspecialchars($array_info_accounts[$i]["Profession"]);
                                            }
                                            echo "</td>
                                        </tr>
                                        <tr>
                                            <td class='col1'>Préférence&ensp;: </td>
                                            <td class='col2'>";
                                            if( ($array_info_accounts[$i]["Preference"])!=NULL ){
                                                echo htmlspecialchars($array_info_accounts[$i]["Preference"]);
                                            }
                                            echo "</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>"; //&ensp; : espace (barre espace), évite d'éventuels retours ligne automatiques
                        }
                    }
                    else {
                        echo "<p>Aucun profil trouvé</p>";
                    }
                }
                catch(PDOException $e) {
                    echo "Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage());
                }
            ?>
        </div>
    </div>
</body>
</html>
