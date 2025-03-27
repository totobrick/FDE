<?php
    session_start();
    if ( !isset($_SESSION['is_connected']) || $_SESSION['is_connected'] != 'oui' || !isset($_SESSION['ID']) || !isset($_SESSION['Pseudo']) ){
        echo "Vousn'êtes pas connecté.";
        $_SESSION['error_msg'] = "Vous n'êtes pas connecté à votre compte.<br>Veuillez vous connecter.";
        //header("Location: login.php");
        exit;
    }
    $ID = $_SESSION['ID'];
    
    $servername = "localhost";
    $login = "root";
    $pass = "";
    $database = "cy_love_database";

    try{
        $connexion = new PDO("mysql:host=$servername;dbname=$database", $login, $pass);
        $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); //PDO error mode

        /* -------------- Variables -------------- */
        // 1. General variables
        $ID = $_SESSION["ID"];
        
        // 2. Variables for upload profile picture
        $file_user = "Accounts/ID_" . $ID;
        $target_file = $file_user . "/profile_picture/profile_picture_ID_" . $ID . ".jpg";
        $uploadOK = 1;
        $imgFileType = strtolower(pathinfo(basename($_FILES['PP-image']['name']),PATHINFO_EXTENSION));
            //pathinfo() : get image extension
            //basename() : show filename uploaded (not all path)

        /* -------------- Verification tests -------------- */
        if( ($imgFileType!=='jpg' && $imgFileType!=='jpeg') && $imgFileType!==''){
            echo "Seul le format JPG est accepté pour les photos de profil.";
            $_SESSION['error_msg'] = "Seul le format JPG est accepté pour les photos de profil.";
            //header("Location: personal-account.php");
            exit;
        }

        /* -------------- MODIFY (or add) PROFILE PICTURE -------------- */
        if( !file_exists("Accounts/") ){
            mkdir("Accounts/");
        }
        // create directory
        if( !file_exists($file_user)){
            mkdir($file_user);
            mkdir($file_user . "/profile_picture");
        }

        //check if an img was selected to be uploaded + if the form is submitted
        if( !empty($_FILES["PP-image"]["tmp_name"])) {
            $check = getimagesize($_FILES["PP-image"]["tmp_name"]); // getimagesize(): get image infos, or return false if this is not an img
            if($check !== false) { //check if file is an img
                $uploadOK = 1;
            }
            else {
                echo "\nLe fichier n'est pas une image";
                $_SESSION['error_msg'] = "Le fichier n'est pas une image.";
                $uploadOK = 0;
                //header("Location: personal-account.php");
                exit;
            }
        }
        else{
            $uploadOK = -1;
            echo "\nErreur: uploadOK= -1";
        }

        //UPLOAD (or replace) image
        if ($uploadOK == 1) {
            if (move_uploaded_file($_FILES["PP-image"]["tmp_name"], $target_file)) {
                /*  move_uploaded_file() :  upload the file in $target_file.
                                            replace the file with the identical name (if this file exists)
                                        $target_file : give the location where the file will be placed
                                        $target_file : can modify the initial name of the file (ex: $target_file = 'dir1/dir2/new_name_file.jpg' )
                */
                $query_PP = $connexion->prepare(
                    "UPDATE user_info
                    SET Photo_de_profil = :targetFile
                    WHERE ID = :ID;"
                );
                $query_PP->bindParam(':ID', $ID); //bind parameters
                $query_PP->bindParam(':targetFile', $target_file);
                $query_PP->execute();
                echo "\nNouvelle photo de profil enregistrée avec succès.";
            }
            else {
                echo "\nDésolé, une erreur est survenue lors du téléchargement du fichier.";
                $_SESSION['error_msg'] = "Désolé, une erreur est survenue lors du téléchargement du fichier.";
                //header("Location: personal-account.php");
                exit;
            }
        }
        elseif( $uploadOK == 0 ) {
            echo "\nVotre fichier n'a pas été téléchargé.";
            $_SESSION['error_msg'] = "Votre fichier n'a pas été téléchargé.";
            //header("Location: personal-account.php");
            exit;
        }
        $_SESSION['error_msg'] = "Votre photo de profil a été changée.";
        //header("Location: personal-account.php");
        exit;




        $query_PP = $connexion->prepare("
                SELECT Photo_de_profil FROM user_info
                WHERE ID = :ID");
        $query_PP->bindParam(':ID', $ID); //bind parameters
        $query_PP->execute();
        $path_img = $query_PP->fetch(PDO::FETCH_ASSOC); //associative array
        exit;
        
    }
    catch (PDOException $e){
        echo "Connexion impossible à la base de données: " . $e->getMessage();
        exit;
    }
?>