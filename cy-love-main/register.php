<?php
    session_start();
    /*echo "<p color='white'>";
    print_r($_SESSION);
    echo "</p>";*/
    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        //redirection to personal-account.php
        $_SESSION['error_msg'] = "Vous êtes déjà inscrit(e).<br>Déconnectez vous pour créer un autre compte.";
        header("Location: personal-account.php");
        exit();
    }
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <link rel="stylesheet" href="Styles/style2.css">
    <link rel="stylesheet" href="Styles/style4.css">
    <title>CY LOVE : Inscription</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'?>
        <div class="form-box_register">
            <div class="register-container" id="register">
                <form action="verif_register.php" method="POST">
                    <div class="top">
                        <header>S'inscrire</header>
                        <span>J'ai déjà un compte ? <a href="login.php" onclick="login()">Se connecter</a></span>

                        <?php
                            if(isset($_SESSION['error_msg'])){
                                echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                            }
                            unset($_SESSION['error_msg']); // remove only this session variable
                        ?>
                    </div>
                    <div class="input-box" id="gender">
                        <label for="gender">Genre</label>
                        <div class="select-gender">
                            <div>
                                <input type="radio" name="gender" value="Madame" <?php if( isset($_SESSION['register_gender']) && $_SESSION['register_gender']=="Madame" ){ echo "checked";}?> required>Madame
                            </div>
                            <div>
                                <input type="radio" name="gender" value="Monsieur" <?php if( isset($_SESSION['register_gender']) && $_SESSION['register_gender']=="Monsieur" ){ echo "checked";}?> required>Monsieur
                            </div>
                            <div>
                                <input type="radio" name="gender" value="Non binaire" <?php if( isset($_SESSION['register_gender']) && $_SESSION['register_gender']=="Non binaire" ){ echo "checked";}?> required>Non binaire
                            </div>
                            <div>
                                <input type="radio" name="gender" value="Non défini" <?php if( isset($_SESSION['register_gender']) && $_SESSION['register_gender']=="Non défini" ){ echo "checked";}?> required>Non défini
                            </div>
                        </div>
                    </div>
                    <div class="input-box">
                        <input type="text" name="Firstname" class="input-field" placeholder="Prénom" <?php if(isset($_SESSION['register_Firstname'])){echo "value=\"" . $_SESSION['register_Firstname'] . "\"";}?> required>
                            
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="text" name="Name" class="input-field" placeholder="Nom" <?php if(isset($_SESSION["register_Name"])){echo "value=\"" . $_SESSION["register_Name"] . "\"";}?> required>
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="email" name="Email" class="input-field" placeholder="Email" <?php if(isset($_SESSION["register_Email"])){echo "value=\"" . $_SESSION["register_Email"] . "\"";}?> required>
                        <i class="bx bx-envelope"></i>
                    </div>
                    <div class="input-box">
                        <input type="text" name="Pseudo" class="input-field" placeholder="Pseudo" <?php if(isset($_SESSION["register_Pseudo"])){echo "value=\"" . $_SESSION["register_Pseudo"] . "\"";}?> required>
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="password" name="Password" class="input-field" placeholder="Mot de passe" required>
                        <i class="bx bx-lock-alt"></i>
                    </div>
                    <div class="input-box">
                        <select name="Preference" class="input-field" required>
                            <option value="" disabled selected>Choisissez votre préférence</option>
                            <option value="Cerise" <?php if( isset($_SESSION['register_Preference']) && $_SESSION['register_Preference']=="Cerise" ){ echo "selected";}?>>Cerise: Trouver sa moitié</option>
                            <option value="Raisin" <?php if( isset($_SESSION['register_Preference']) && $_SESSION['register_Preference']=="Raisin" ){ echo "selected";}?>>Raisin: Boire un verre sans se prendre la grappe</option>
                            <option value="Pasteque" <?php if( isset($_SESSION['register_Preference']) && $_SESSION['register_Preference']=="Pasteque" ){ echo "selected";}?>>Pastèque: Des câlins sans pépins</option>
                            <option value="Peche" <?php if( isset($_SESSION['register_Preference']) && $_SESSION['register_Preference']=="Peche" ){ echo "selected";}?>>Pêche: Un coup d'un soir</option>
                        </select>
                        <i class="bx bx-heart"></i>
                    </div>
                    <div class="input-box">
                        <input type="submit" class="submit" value="Valider">
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php session_unset(); ?>
    <script>
       function register() {
            var x = document.getElementById("login");
            var y = document.getElementById("register");

            x.style.left = "-510px";
            y.style.right = "5px";
            x.style.opacity = 0;
            y.style.opacity = 1;
       }
    </script>
</body>
</html>