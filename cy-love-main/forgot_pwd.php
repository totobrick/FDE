<?php
    session_start();
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        //redirection to personal-account.php
        header("Location: personal-account.php");
        exit();
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <title>CY LOVE : MDP oublié</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'?>
        <div class="form-box_login">
            <div class="login-container" id="login">
                <form method="post" action="forgot_pwd_get-pwd-and-mail.php" class="login-form">
                    <div class="top">
                        <header>Récupération de mot de passe</header>
                        <span>
                            Pour récupérer votre compte, entrez votre pseudo ci-dessous.<br>
                            Un mail contenant le mot de passe vous sera envoyé.
                        </span>
                        <?php
                            if(isset($_SESSION['error_msg'])){
                                echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                            }
                            unset($_SESSION['error_msg']); // remove only this session variable
                        ?>
                    </div>
                    <div class="input-box">
                        <label class="label-hidden" for="pseudo"></label>
                        <input type="text" id="pseudo" name="pseudo" class="input-field" placeholder="Votre pseudo" required>
                    </div>
                    <!--<div class="input-box">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" class="input-field" required>
                    </div>-->
                    <div class="input-box">
                        <input type="submit" class="submit" value="Récupérer le mot de passe">
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
