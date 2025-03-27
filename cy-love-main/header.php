<link rel="stylesheet" href="Styles/style_header.css">
<nav class="nav">
    <div class="nav-logo">
        <img src="Logos/logo_CY_Love.svg" alt="Logo CY Love" onclick="document.location='login.php'">
    </div>
    <div class="nav-button">
        <?php
            if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
                //session open
                echo "<button class=\"btn white-btn\" id=\"login-btn\" onclick=\"window.location.href='logout.php'\">Se déconnecter</button>";
            }
            else{
                echo "<button class=\"btn white-btn\" id=\"login-btn\" onclick=\"window.location.href='login.php'\">Se connecter</button>";
            }
        ?>
        <button class="btn" id="register-btn" onclick="window.location.href='register.php'">S'inscrire</button>
    </div>
    <div class="nav-right"><!-- style="display: flex; justify-content: space-between; height: 100%; align-items: center;"-->
        <?php
            if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
                //session open
                $ID = $_SESSION['ID'];
                echo "  <div class=\"menu-profile-picture\">";

                // Cache-Buster : génère imgs à URL uniques (Attention à ne pas surcharger le cache)
                if(!isset($_SESSION['cache_buster'])){
                    $_SESSION['cache_buster'] = (int) (microtime(true) * 1000);
                    /*  microtime(true) :   nbre de secondes écoulés depuis le 1er janvier 1970 (début de l'époque Unix)
                                            c'est un float, contrairement à time
                        (int) : rend entier le float
                        BUT :   - rendre l'URL unique en ajoutant le nbre de millisecondes écoulés depuis le 1er janvier 1970.
                                - cela permet en JS (function loadPPimg()) de recharger l'image si elle a été changée
                                    ce qui n'est pas possible si on ne met que $path_profile_picture car le navigateur a l'image en cache et ne fera pas le changement d'image
                    */
                }
                    
                $path_profile_picture = "Accounts/ID_" . $ID . "/profile_picture/profile_picture_ID_" . $ID . ".jpg";
                if(!file_exists($path_profile_picture)){
                    $path_profile_picture = "Logos/profile_picture.svg";
                    echo "  <div class=\"profile-img vertical-img\">
                                <img src=$path_profile_picture?t=" . $_SESSION['cache_buster'] . " alt=\"IMG\"onclick=\"document.location='personal-account.php'\">
                            </div>";
                }
                else{
                    list($width, $height, $type, $attr) = getimagesize($path_profile_picture);
                    if($height >= $width){
                        echo "  <div class=\"profile-img vertical-img\">";
                    }
                    else{
                        echo "  <div class=\"profile-img horizontal-img\">";
                    }
                    echo "          <img src=$path_profile_picture?t=" . $_SESSION['cache_buster'] . " onclick=\"document.location='personal-account.php'\">
                                </div>";
                }
                echo "  </div>";
            }
        ?>
        <div class="menu-btn" id="menu-btn" onclick="myMenuFunction()">
            <div class="bar1"></div>
            <div class="bar2"></div>
            <div class="bar3"></div>
        </div>
    </div>
    <div class="nav-menu" id="navMenu">
        <div class="nav-menu-content">
            <ul>
                <li><a href="login.php" class="link active">Menu principal</a></li>
                <li><a href="personal-account.php" class="link">Compte</a></li>
                <li><a href="search.php" class="link">Rechercher un compte</a></li>
                <li><a href="service.php" class="link">Services & Abonnements</a></li>
                <li><a href="10profil.php" class="link">Voir 10 profils</a></li>
            </ul>
        </div>
    </div>
</nav>
<script>
    function myMenuFunction() {
        var i = document.getElementById("menu-btn");
        var j = document.getElementById("navMenu");
        if(i.className === "menu-btn") {
            i.className += " responsive";
            j.className += " responsive";
        } else {
            i.className = "menu-btn";
            j.className = "nav-menu";
        }
    }
</script>