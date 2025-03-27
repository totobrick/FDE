<?php
    // Start the session
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        if( isset($_SESSION['Admin']) && $_SESSION['Admin'] == 'oui'){
            //do nothing
        }
        else{
            $_SESSION['error_msg'] = "Vous n'êtes pas administrateur !";
            header('Location: personal-account.php');
            exit;
        }
    }
    elseif( !isset($_POST["submit"]) ){
        //someone not connected on this page ->redirection
        header('Location: login.php');
        exit;
    }
    unset($_SESSION['ID_observed']);

    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style4.css">
    <link rel="stylesheet" href="Styles/style5_admin.css">
    <!--Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
            -> session_lifespan.js ne fonctionne pas sans 
            -> le script en bas de page ne fonctionne pas sans
    -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="session_lifespan.js"></script>
    <title>CY Love : Admin</title>
</head>
<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <?php include 'account_icon_bar.php'?>
        <div class="profiles-block">
            
            <div class="form_search">
                <div class="top">
                    <header>Liste de tous les profils</header>
                    <?php
                        if(isset($_SESSION['error_msg'])){
                            echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                        }
                        unset($_SESSION['error_msg']); // remove only this session variable
                    ?>
                </div>
                <div class="search-profiles-container">
                    <form action="admin.php" method="GET">
                        <div class="input-box1">
                            <label for="keyword"></label>
                            <input type="text" id="keyword" name="keyword" class="input-field-search" placeholder="Rechercher"
                                <?php
                                    if( isset($_GET['keyword'])){
                                        echo "value=\"" . $_GET['keyword'] . "\"";
                                    }
                                ?>
                            >
                        </div>
                        <div class="input-box2">
                            <?php
                                if ( file_exists("Logos/logo_search.svg") ){
                                    echo "<input type=\"image\" name=\"submit-btn\" src=\"Logos/logo_search.svg\" alt=\"Rechercher\" class=\"submit-search\">";//<!--define an img as a submit button-->
                                }
                                else{
                                    echo "<input type=\"submit\" name=\"submit-btn\" class=\"submit-search\" value=\"Rechercher\" style=\"padding: 0 10px;\">";
                                }
                            ?>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="profiles-list">
                <?php
                    // Connexion à la base de données
                    $servername = "localhost";
                    $username = "root";
                    $password = "";
                    $database = "cy_love_database";

                    try {
                        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
                        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                        if(isset($_GET['keyword'])) {
                            // Récupération du mot-clé de recherche
                            $keyword = $_GET['keyword'];
                            // Recherche profils correspondant à la recherche (on recherche dans pseudo, nom, prénom ...)
                            $sql = "SELECT * FROM user_info WHERE Genre LIKE :keyword
                                        OR Preference LIKE :keyword
                                        OR Pseudo LIKE :keyword
                                        OR Profession LIKE :keyword
                                        OR Nom LIKE :keyword
                                        OR Prénom LIKE :keyword
                                        OR Email LIKE :keyword
                                        OR ID LIKE :keyword"; //LIKE permet de comparer la présence de caractères ou chaines de caractères
                            $stmt = $conn->prepare($sql);
                            $stmt->bindValue(':keyword', "%$keyword%", PDO::PARAM_STR);
                            $stmt->execute();
                            // array with all infos of all users
                            $array_info_account = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        }
                        else {
                            // Requête SQL pour récupérer les profils (et infos liées)
                            $query = "SELECT * FROM user_info ORDER BY ID ASC"; //LIMIT 40
                            $stmt = $conn->prepare($query);
                            $stmt->execute();
                            // array with all infos of all users
                            $array_info_account = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        }

                        // Vérifier s'il y a des résultats
                        for ($i=0; $i<count($array_info_account); $i++) {
                            // Affichage des profils
                            echo "
                                <div class='profile-box'>
                                    <div class='profile-container'>
                                        <div class='profile-pseudo'>" . htmlspecialchars($array_info_account[$i]["Pseudo"]) . "
                                        </div>
                            ";

                            // Afficher la photo si elle existe
                            $path_contact_profile_picture = htmlspecialchars($array_info_account[$i]["Photo_de_profil"]);
                            if(!file_exists($path_contact_profile_picture)){
                                $path_contact_profile_picture = "Logos/profile_picture.svg";
                                echo "  <div class=\"profile-picture vertical-img\">
                                            <img src=$path_contact_profile_picture alt=\"IMG\">
                                        </div>";
                            }
                            else{
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
                                                    <td class='col1'>ID&ensp;: </td>
                                                    <td class='col2'>" . htmlspecialchars($array_info_account[$i]["ID"]) . "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Prénom&ensp;: </td>
                                                    <td class='col2'>" . htmlspecialchars($array_info_account[$i]["Prénom"]) . "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Nom&ensp;: </td>
                                                    <td class='col2'>" . htmlspecialchars($array_info_account[$i]["Nom"]) . "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Sexe&ensp;: </td>
                                                    <td class='col2'>";
                                                    if( ($array_info_account[$i]["Genre"])!=NULL ){
                                                        echo htmlspecialchars($array_info_account[$i]["Genre"]);
                                                    }
                                                    echo "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Profession&ensp;: </td>
                                                    <td class='col2'>";
                                                    if( ($array_info_account[$i]["Profession"])!=NULL ){
                                                        echo htmlspecialchars($array_info_account[$i]["Profession"]);
                                                    }
                                                    echo "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Mail&ensp;: </td>
                                                    <td class='col2'>" . htmlspecialchars($array_info_account[$i]["Email"]) . "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>MDP&ensp;: </td>
                                                    <td class='col2'>" . htmlspecialchars($array_info_account[$i]["Mot_de_passe"]) . "</td>
                                                </tr>
                                                <tr>
                                                    <td class='col1'>Préférence&ensp;: </td>
                                                    <td class='col2'>";
                                                    if( ($array_info_account[$i]["Preference"])!=NULL ){
                                                        echo htmlspecialchars($array_info_account[$i]["Preference"]);
                                                    }
                                                    echo "</td>
                                                </tr>
                                            </table>
                                        </div>"; //&ensp; : espace (barre espace), évite d'éventuels retours ligne automatiques

                            if ( $array_info_account[$i]["ID"] != $_SESSION["ID"] && $array_info_account[$i]["Admin"] != "oui"){
                                echo "
                                        <form action='admin_delete_account.php' method='post'>
                                            <input type='hidden' name='id_user_delete' value='" . $array_info_account[$i]["ID"] . "'>
                                            <button type='submit' class='delete_account btn'>
                                                <span>Supprimer le compte</span>
                                                <div class=\"red_cross\">
                                                    <div class=\"bar1\"></div>
                                                    <div class=\"bar2\"></div>
                                                </div>
                                            </button>
                                        </form>";
                            }
                            else{
                                echo "
                                        <div class='delete_account admin'>
                                            <p>Administrateur</p>
                                        </div>";
                            }
                            echo "
                                        <div class='profile-btn'>
                                            <form action='admin_see_chat_history.php' method='post'>
                                                <input type='hidden' name='id_user' value='" . $array_info_account[$i]["ID"] . "'>
                                                <button type='submit'>Historique des messages</button>
                                            </form>
                                            <button class='write_profile' data-id='" . $array_info_account[$i]["ID"] . "'>Ecrire à cette personne</button>
                                        </div>
                                    </div>
                                </div>";
                        }
                    }
                    catch (PDOException $e) {
                        echo "<p>Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage()) . "</p>";
                    }
                ?>
            </div>
        </div>
    </div>
    <script>
        $('.write_profile').click(function() {   //get the click
            var contactID = $(this).data('id'); //get contactID
            $.ajax({                            //requête asynchrone au serveur
                type: 'POST',
                url: 'store_contact_id.php',
                data: { contact_id: contactID },
                success: function(response) {
                    console.log(response);      //show response into the console
                    window.location.href = "chat.php";
                },
                error: function(xhr, status, error) {
                    console.error(xhr.responseText);
                }
            });
        });
    </script>
</body>
</html>