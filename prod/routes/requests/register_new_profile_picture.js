const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: "../../public/images/" });
const {isConnected, queryPromise} = require("./../functions/functions.js");

router.post('/register_new_profile_picture', upload.single('Profile_picture'), async (req, res) => {
    console.log("\nPage : /register_new_profile_picture");
    console.log("Variables de session : ", req.session);
    console.log("Fichier recu : ", req.file);

    try{
        /* -------------- Variables -------------- */
        // 1. General variables
        const user_id = req.session.user_id;
        
        // 2. Variables for upload profile picture
        const dir_user = path.join(__dirname, "../../public/images/Accounts/ID_" + user_id);
        const dir_user_PP = path.join(dir_user, "profile_picture");
        //const target_file = file_user + "/profile_picture/profile_picture_ID_" + user_id + ".jpg";
        var uploadOK = 1;

        /* -------------- MODIFY (or add) PROFILE PICTURE -------------- */
        console.log("__dirname : ", __dirname);
        console.log("fs.existsSync(" + dir_user + ") : ", fs.existsSync(dir_user));

        // create directory
        if( ! fs.existsSync(dir_user)){
            fs.mkdirSync(dir_user_PP, { recursive : true });
            console.log("Create directory : ", dir_user_PP);
        }
        

        //check if an img was selected to be uploaded + if the form is submitted
        /*if( !empty($_FILES["PP-image"]["tmp_name"])) {
            $check = getimagesize($_FILES["PP-image"]["tmp_name"]); // getimagesize(): get image infos, or return false if this is not an img
            if($check !== false) { //check if file is an img
                uploadOK = 1;
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
                /*$query_PP = $connexion->prepare(
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
      */  
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;