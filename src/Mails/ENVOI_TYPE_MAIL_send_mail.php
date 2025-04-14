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
    if (!file_exists(__DIR__ . '/mail_contents.php')) {
        echo "Fichier mail_contents.php non trouvé.<br>";
        exit;
    }

    require_once realpath(__DIR__ . '/vendor/autoload.php');    //ce chemin est absolu
    //OU : require 'vendor/autoload.php'; (chemin relatif)
                                                                
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    // Lecture du contenu de mail_contents.php
    ob_start();                                 //stocke dans mémoire tampon (buffer) ce qui suit
    include(__DIR__ . '/mail_contents.php');
    $mailContent = ob_get_clean();              //get the content of mail_contents.php and clear buffer

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
        $mail->setFrom($_ENV['SMTP_username'], 'Mailer');
        $mail->addAddress($_ENV['SMTP_mail_receiver']);

        //Mail
        $nb= 2;
        $mail->isHTML(true);
        $mail->CharSet  = 'UTF-8';           //Encodage en UTF-8 pour caractères spéciaux (ex : °)
        $mail->Subject  = "Objet du mail test n°" . $nb;
        $mail->Body     = "Voici le msg n°" . $nb . " en <u><b>HTML</b></u>.
                        <br>" .  $mailContent;
        $mail->AltBody  = "Voici le msg n°" . $nb . " non-HTML.";

        $mail->send();
        echo "Mail envoyé avec succès.";
    }
    catch (Exception $e){
        echo "Echec de l'envoi du mail. Erreur de messagerie: {$mail->ErrorInfo}";
    }

?>