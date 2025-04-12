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
    <title>FDE : Connexion</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')"> <!--Background image : https://img.freepik.com/photos-gratuite/jeune-couple-romantique-sexy-amoureux-heureux-plage-ete-ensemble-s-amusant-portant-maillots-bain-montrant-signe-du-coeur-sundet_285396-6545.jpg?t=st=1715103572~exp=1715107172~hmac=144c7e5b0ff875c6caeab703b9f2860b0da711ca04f6eb9e9186eb8b7e9f819d&w=2000-->
    <div class="wrapper">
        <?php include 'header.php'?>
        <main>
            <div class="container">
                <div class="form-box_login">
                    <div class="login-container">
                        <!--<form action="verif_login.php" method="post">-->
                            <div class="top">
                                <header>Se connecter</header>
                                <span>Vous ne possédez pas de compte ? <a href="register.php" onclick="register()">S'inscrire</a></span>
                                <div class="error_msg" id="error_msg">
                                <?php
                                    if(isset($_SESSION['login'])){
                                        echo "<b style=\"color: rgb(255, 0, 0)\">ATTENTION !</b>
                                            Le mot de passe de " . $_SESSION['login'] . " est incorrect, veuillez réessayer.";
                                    }
                                    if(isset($_SESSION['error_msg'])){
                                        echo $_SESSION['error_msg'];
                                    }
                                    unset($_SESSION['error_msg']); // remove only this session variable
                                ?>
                                </div>
                            </div>
                            <div class="input-box">
                                <input type="text" name="login" class="input-field" id="login" width="40%" placeholder="Login">
                                <i class="bx bx-user"></i>
                            </div>
                            <div class="input-box">
                                <input type="password" name="Password" class="input-field" id="password" placeholder="Mot de passe">
                                <i class="bx bx-lock-alt"></i>
                            </div>
                            <div class="input-box">
                                <button class="submit" id="submit123" onclick="submit()">Connexion</button>
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
                        <!--</form>-->
                    </div>
                </div>
            </div>
        </main>
    <?php session_unset(); ?>
    
    <script>

        function sendData(){
            const login = document.getElementById("login").value;
            const password = document.getElementById("password").value;
            document.getElementById("error_msg").innerHTML = "Bonjour," + login +","+ password +".";
            
            const test = fetch('/verif_login',{
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({login, password})
            });
            document.getElementById("error_msg").innerHTML = test.text();

            
        }

        const express = require('express');
        const app = express();
        app.use(express.json());
        
        app.get("/verif_login", (req,res)=>{
            res.send("Bien reçu !");
        })
        
    </script>

</body>
</html>
