<?php
    session_start();
    // Nouvelle activité, on met à jour la variable pour la déconnexion automatique (après un certain temps d'inactivité)
    $_SESSION['last_activity_time'] = time();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style8_search.css">
    <!--Le script jquery est essentiel pour faire fonctionner JQUERY et AJAX :
            -> session_lifespan.js ne fonctionne pas sans 
            -> le script en bas de page ne fonctionne pas sans
    -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="session_lifespan.js"></script>
    <title>CY LOVE : rechercher</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'; ?>
        <?php
            if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
                include 'account_icon_bar.php';
            }
        ?>
        <div class="profiles-block">
            <div class="form_search">
                <div class="top">
                    <header>Recherche de profils</header>
                    <span>Veuillez entrer un mot clé de recherche <i>(pseudo, sexe, profession, préférence ...)</i>.</span>
                    <?php
                        if(isset($_SESSION['error_msg'])){
                            echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                        }
                        unset($_SESSION['error_msg']); // remove only this session variable
                    ?>
                </div>
                <div class="search-profiles-container">
                    <form action="search.php" method="GET">
                        <div class="input-box1">
                            <label for="keyword"></label>
                            <input type="text" id="keyword" name="keyword" class="input-field-search" placeholder="Mot-clé"
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
            <?php
                // Vérifier si le mot-clé de recherche est présent
                if(isset($_GET['keyword'])) {
                    // Connexion à la base de données
                    $servername = "localhost";
                    $username = "root";
                    $password = "";
                    $database = "FDE_database";

                    echo "<div class=\"profiles-list\">";

                    try {
                        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
                        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                        // Récupération du mot-clé de recherche
                        $keyword = $_GET['keyword'];

                        // Recherche profils correspondant à la recherche (on recherche dans pseudo, nom, prénom ...)
                        $sql = "SELECT * FROM user_info WHERE gender LIKE :keyword
                                    OR login LIKE :keyword
                                    OR profession LIKE :keyword
                                    OR last_name LIKE :keyword
                                    OR first_name LIKE :keyword
                                    OR mail LIKE :keyword
                                    OR ID LIKE :keyword"; //LIKE permet de comparer la présence de caractères ou chaines de caractères
                        $stmt = $conn->prepare($sql);
                        $stmt->bindValue(':keyword', "%$keyword%", PDO::PARAM_STR);
                        $stmt->execute();
                        // array with all infos of all users
                        $array_info_account = $stmt->fetchAll(PDO::FETCH_ASSOC);

                        // Vérifier s'il y a des résultats
                        if (count($array_info_account) > 0) {
                            for ($i=0; $i<count($array_info_account); $i++) {
                                // Affichage des profils
                                echo "
                                    <div class='profile-box'>
                                        <div class='profile-container'>
                                            <div class='profile-pseudo'>" . htmlspecialchars($array_info_account[$i]["login"]) . "
                                            </div>
                                ";

                                // Afficher la photo si elle existe
                                $path_contact_profile_picture = htmlspecialchars($array_info_account[$i]["profile_picture"]);
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
                                                <td class='col1'>Sexe&ensp;: </td>
                                                <td class='col2'>";
                                                if( ($array_info_account[$i]["gender"])!=NULL ){
                                                    echo htmlspecialchars($array_info_account[$i]["gender"]);
                                                }
                                                echo "</td>
                                            </tr>
                                            <tr>
                                                <td class='col1'>Profession&ensp;: </td>
                                                <td class='col2'>";
                                                if( ($array_info_account[$i]["profession"])!=NULL ){
                                                    echo htmlspecialchars($array_info_account[$i]["profession"]);
                                                }
                                                echo "</td>
                                            </tr>
                                        </table>
                                    </div>"; //&ensp; : espace (barre espace), évite d'éventuels retours ligne automatiques

                        echo "
                                            <div class='profile-btn'>
                                                <button class='write_profile' data-id='" . $array_info_account[$i]["ID"] . "'>Ecrire à cette personne</button>
                                            </div>
                                        </div>
                                    </div>";
                            }
                            
                        }
                        else {
                            echo "<p class='no-result'>Aucun résultat trouvé</p>";
                        }
                    }
                    catch(PDOException $e) {
                        echo "Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage());
                    }
                    echo "</div>";
                }
            ?>
        </div>
    </div>
    
    <script>
        //Redirection pour écrire au profil
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