<?php
    session_start();
    /*echo "<p color='white'>";
    print_r($_SESSION);
    echo "</p>";*/
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
    <link rel="stylesheet" href="Styles/style4.css">
    <title>CY LOVE : Vérification code</title>
</head>

<body style="background-image: url('Images/Background_images.jpg')">
    <div class="wrapper">
        <?php include 'header.php'?>
        <div class="form-box_register">
            <div class="code-container" id="code">
                <form action="verif_register_verifMailCode.php" method="POST">
                    <div class="top">
                        <header>Vérification</header>
                        <span>
                            Entrez ci-dessous le code de vérification de votre boîte mail <b>sans espaces</b>.<br>
                            Si vous n'avez rien reçu, vérifiez vos spams ou modifiez votre mail d'inscription <a href="register.php">ici</a> (il comporte peut-être une erreur de frappe).</span>
                        <?php
                            if(isset($_SESSION['error_msg'])){
                                echo "<div class='error_msg'>" . $_SESSION['error_msg'] . "</div>";
                            }
                            unset($_SESSION['error_msg']); // remove only this session variable
                        ?>
                    </div>
                    <div class="input-box">
                        <input type="text" name="Code" class="input-field" placeholder="Code" required>
                        <i class="bx bx-user"></i>
                    </div>
                    <div class="input-box">
                        <input type="submit" class="submit" value="Valider">
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>