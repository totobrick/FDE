<?php
    session_start();

    if ( isset($_SESSION['is_connected']) && $_SESSION['is_connected'] == 'oui' && isset($_SESSION['ID']) && isset($_SESSION['login']) ){
        //redirection to personal-account.php
        header("Location: ../personal-account.php");
        exit();
    }

    $Mail_recipient = $_SESSION["register_Email"];
    echo "<br>Mail : " . $Mail_recipient . "<br>";

    $code = rand(10**11, 999999999999); // 100 000 000 000 <= $code < 999 999 999 999
    $code_part1 = $code%10**3;
    $code_part2 = ($code%10**6 - $code_part1)/10**3;
    $code_part3 = ($code%10**9 - $code_part1 - $code_part2*10**3)/10**6;
    $code_part4 = ($code%10**12 - $code_part1 - $code_part2*10**3 - $code_part3*10**6)/10**9;
    $code_with_spaces = str_pad($code_part4,3,"0", STR_PAD_LEFT) . " " . str_pad($code_part3,3,"0", STR_PAD_LEFT) . " " . str_pad($code_part2,3,"0", STR_PAD_LEFT) . " " . str_pad($code_part1,3,"0", STR_PAD_LEFT);
    //str_pad($code_part4,3,"0", STR_PAD_LEFT) : permet de rajouter des 0 manquants à gauche pour avoir tjs 3 chiffres (ex: on a 011 au lieu de 11)
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
        $mail->isSMTP();                                //les serveurs de messagerie sont des serveurs SMTP
        $mail->Host         = $_ENV['SMTP_host'];       //adresse serveur
        $mail->SMTPAuth     = true;                     //authentification SMTP
        $mail->Username     = $_ENV['SMTP_username'];
        $mail->Password     = $_ENV['SMTP_password'];
        $mail->SMTPSecure   = $_ENV['SMTP_ENCRYPTION']; //$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;/
        $mail->Port         = $_ENV['SMTP_port'];       //$mail->Port = 587; //fourni par serveur de messagerie: gmail, outlook ...
        
        //Expéditeur et destinataire
        $mail->setFrom($_ENV['SMTP_username'], 'FDE : Gestionaire d\'électricité');
        $mail->addAddress($Mail_recipient);

        //Contenu du mail
        $Mail_content   = file_get_contents('content_mail_verif_register.html');
        $Mail_content   = str_replace('{Code_verif}', $code_with_spaces, $Mail_content); //str_replace : permet de remplacer du texte dans le fichier (par un chemin ici)
        $Mail_content   = str_replace('{Background_img_en_JPG}', 'cid:cid_background_img', $Mail_content);//image ajoutée plus bas
        $Mail_content   = str_replace('{Logo_CY_Love_en_PNG}', 'cid:cid_logo_CY_Love', $Mail_content);//image ajoutée plus bas

        //Mail
        $mail->isHTML(true);
        $mail->CharSet  = 'UTF-8';           //Encodage en UTF-8 pour caractères spéciaux (ex : °)
        $mail->Subject  = "CY Love : Vérification de votre identité";
        $mail->AddEmbeddedImage('../Logos/FDE_PNG/logo_FDE.png', 'cid_logo_CY_Love');//Images svg non prises en compte par mail, il faut les convertir en png (utilisation de la commande 'convert' de imagemagick dans le terminal
        //$mail->AddEmbeddedImage('../Images/Background_images.jpg', 'cid_background_img');
        $mail->Body     = $Mail_content;
        /*$mail->Body     = " <p>Code de vérification : " . $code_with_spaces . "</p>
                            <p>Le code ci-dessus doit être saisi sans les espaces.</p>
                        ";*/
        $mail->AltBody  = "Code de vérification (à saisir sans espaces): " . $code_with_spaces;
        
        //Envoi du mail
        $mail->send();
        echo "Mail envoyé avec succès.";
        $_SESSION["Code"] = $code;
        $_SESSION['error_msg'] = "Mail envoyé avec succès.";
        header("Location: ../verif_register_enterMailCode.php");
        exit;
    }
    catch (Exception $e){
        echo "Echec de l'envoi du mail. Erreur de messagerie: {$mail->ErrorInfo}";
        $_SESSION['error_msg'] = "Echec de l'envoi du mail. Erreur de messagerie: {$mail->ErrorInfo}";
        header("Location: ../register.php");
        exit;

    }
?>

<!--
<script>
    function send_form(){
        var register = document.getElementById()
        register.classList.add("close");
        var code = document.getElementById("code");
        code.classList.add("open");

        var code = Math.floor(Math.random()*9*10**11) + 10**11; // 100 000 000 000 <= code < 999 999 999 999
        var code_part1 = code%10**3;
        var code_part2 = (code%10**6 - code_part1)/10**3;
        var code_part3 = (code%10**9 - code_part1 - code_part2*10**3)/10**6;
        var code_part4 = (code%10**12 - code_part1 - code_part2*10**3 - code_part3*10**6)/10**9;
        document.getElementById("register").innerHTML =
                "code : " + code +
                "<br> code 2 : " + code_part4.toString().padStart(3, "0") + " " + code_part3.toString().padStart(3, "0") + " " + code_part2.toString().padStart(3, "0") + " " + code_part1.toString().padStart(3, "0");
    }
</script>
-->