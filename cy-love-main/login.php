<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit();
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <title>CY LOVE : Connexion</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')"> <!--Background image : https://img.freepik.com/photos-gratuite/jeune-couple-romantique-sexy-amoureux-heureux-plage-ete-ensemble-s-amusant-portant-maillots-bain-montrant-signe-du-coeur-sundet_285396-6545.jpg?t=st=1715103572~exp=1715107172~hmac=144c7e5b0ff875c6caeab703b9f2860b0da711ca04f6eb9e9186eb8b7e9f819d&w=2000-->
    <div class="wrapper">
        <?php include 'header.php'?>
        <main>
            <div class="container">
                <div class="form-box_login">
                    <div class="login-container" id="login">
                        <form action="verif_login.php" method="post">
                            <div class="top">
                                <header>Se connecter</header>
                                <span>Vous ne possédez pas de compte ? <a href="register.php" onclick="register()">S'inscrire</a></span>
                                <?php
                                    if(isset($_SESSION['login'])){
                                        echo "<div class=\"error_msg\">
                                            <b style=\"color: rgb(255, 0, 0)\">ATTENTION !</b>
                                            Le mot de passe de " . $_SESSION['login'] . " est incorrect, veuillez réessayer.
                                            </div>";
                                    }
                                    if(isset($_SESSION['error_msg'])){
                                        echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                                    }
                                    unset($_SESSION['error_msg']); // remove only this session variable
                                ?>
                            </div>
                            <div class="input-box">
                                <input type="text" name="login" class="input-field" width="40%" placeholder="Login">
                                <i class="bx bx-user"></i>
                            </div>
                            <div class="input-box">
                                <input type="password" name="Password" class="input-field" placeholder="Mot de passe">
                                <i class="bx bx-lock-alt"></i>
                            </div>
                            <div class="input-box">
                                <input type="submit" name="submit" class="submit" value="Connexion">
                            </div>
                            <div class="two-col">
                                <div class="one">
                                    <!--<input type="checkbox" id="login-check">
                                    <label for="login-check">Se souvenir</label>-->
                                </div>
                                <div class="two">
                                    <label><a href="forgot_pwd.php">Mot de passe oublié ?</a></label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    <?php session_unset(); ?>
    
    <script>
        var a = document.getElementById("loginBtn");
        var b = document.getElementById("registerBtn");
        var x = document.getElementById("login");
        var y = document.getElementById("register");

        function login() {
            x.style.left = "4px";
            y.style.right = "-520px";
            a.className += " white-btn";
            b.className = "btn";
            x.style.opacity = 1;
            y.style.opacity = 0;
        }
    </script>

</body>
</html>
