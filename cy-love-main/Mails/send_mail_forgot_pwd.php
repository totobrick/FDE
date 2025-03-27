<?php
    session_start();

    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['Pseudo']) ){
        //redirection to personal-account.php
        header("Location: ../personal-account.php");
        exit;
    }

    //Get password
    if ( isset($_SESSION['temp_ID']) && isset($_SESSION['temp_Pseudo']) && isset($_SESSION['temp_MDP']) && isset($_SESSION['temp_Mail']) ){
        //Variables
        $ID_recipient = $_SESSION['temp_ID'];
        $Pseudo_recipient = $_SESSION['temp_Pseudo'];
        $MDP_recipient = $_SESSION['temp_MDP'];
        $Mail_recipient = $_SESSION['temp_Mail'];
        unset($_SESSION['temp_ID']);
        unset($_SESSION['temp_Pseudo']);
        unset($_SESSION['temp_MDP']);
        unset($_SESSION['temp_Mail']);
    }
    else{
        $_SESSION['error_msg'] = "ERREUR envoi de mail : le mot de passe n'a pas pu être envoyé.";
        header("Location: ../forgot_pwd.php");
        exit;
    }
?>

<?php
    //inclusion des classes
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    use Dotenv\Dotenv;

    if (!file_exists(__DIR__ . '/.env')){
        echo "Fichier .env non trouvé.<br>";
        exit;
    }
    
    require_once realpath(__DIR__ . '/vendor/autoload.php');    //ce chemin est absolu
    //OU : require 'vendor/autoload.php'; (chemin relatif)
                                                                
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $mail = new PHPMailer(true);

    try{
        //$mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();                        //les serveurs de messagerie sont des serveurs SMTP
        $mail->Host         = $_ENV['SMTP_host'];       //adresse serveur
        $mail->SMTPAuth     = true;                 //authentification SMTP
        $mail->Username     = $_ENV['SMTP_username'];
        $mail->Password     = $_ENV['SMTP_password']; 
        $mail->SMTPSecure   = $_ENV['SMTP_ENCRYPTION'];       //$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;/
        $mail->Port         = $_ENV['SMTP_port'];                   //$mail->Port = 587; //fourni par serveur de messagerie: gmail, outlook ...

        //Expéditeur et destinataire
        $mail->setFrom($_ENV['SMTP_username'], 'CY Love');
        $mail->addAddress($Mail_recipient);

        //Contenu du mail
        $Mail_content   = file_get_contents('content_mail_forgot_pwd.html');
        $Mail_content   = str_replace('{ID_utilisateur}', $ID_recipient, $Mail_content); //str_replace : permet de remplacer du texte dans le fichier (par un chemin ici)
        $Mail_content   = str_replace('{Pseudo_utilisateur}', $Pseudo_recipient, $Mail_content);
        $Mail_content   = str_replace('{MDP_utilisateur}', $MDP_recipient, $Mail_content);
        $Mail_content   = str_replace('{Background_img_en_JPG}', 'cid:cid_background_img', $Mail_content);//image ajoutée plus bas
        $Mail_content   = str_replace('{Logo_CY_Love_en_PNG}', 'cid:cid_logo_CY_Love', $Mail_content);//image ajoutée plus bas

        //Mail
        $mail->isHTML(true);
        $mail->CharSet  = 'UTF-8';           //Encodage en UTF-8 pour caractères spéciaux (ex : °)
        $mail->Subject  = "CY Love : Mot de passe oublié";
        $mail->AddEmbeddedImage('../Logos/CY_Love_PNG/Logo_CY_Love_14_(1618x343).png', 'cid_logo_CY_Love'); //Images svg non prises en compte par mail, il faut les convertir en png (utilisation de la commande 'convert' de imagemagick dans le terminal
        $mail->AddEmbeddedImage('../Images/Background_images.jpg', 'cid_background_img');

        $mail->Body     = $Mail_content;
        /*$mail->Body     = "
                            <h1 style='text-align: center'>Votre compte : " . $Pseudo_recipient . "</h1>
                            <img src='cid:cid_logo_CY_Love' alt='cid_logo_CY_Love' style='width: 150px;'>
                            <img src='cid:cid_background_img' alt='cid_background_img' style='width: 300px;'>
                            <p>ID : " . $ID_recipient . "</p>
                            <p>Pseudo : " . $Pseudo_recipient . "</p>
                            <p>Mot de passe : " . $MDP_recipient . "</p>
                        ";*/
        $mail->AltBody  = "Votre compte : " . $Pseudo_recipient . "   ID : " . $ID_recipient . "    Mot de passe : " . $MDP_recipient;

        //Envoi du mail
        $mail->send();
        echo "Mail envoyé avec succès.";
        $_SESSION['error_msg'] = "Mail envoyé avec succès.<br>Veuillez vérifier votre boîte mail.";
        header("Location: ../login.php");
        exit;
    }
    catch (Exception $e){
        echo "Echec de l'envoi du mail. Erreur de messagerie: {$mail->ErrorInfo}";
        $_SESSION['error_msg'] = "Echec de l'envoi du mail. Erreur de messagerie: {$mail->ErrorInfo}";
        header("Location: ../forgot_pwd.php");
        exit;
    }

?>