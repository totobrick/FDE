const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./../functions/functions.js");
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dvvoprwgu',
    api_key: '442214415335732',
    api_secret: 'uIvwK7aHCmXJ4T1OB3R3QjsvbE0'
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); 
        } else {
            cb(new Error('Only image files are allowed!'), false); 
        }
    }
}).single('Profile_picture');

router.post('/registerModificationAccount', upload, async (req, res) => {


    const user_ID = req.session.user_id;

    if(!user_ID) {
        return res.status(200).json({redirect:"/index"});
    }

    if (! req.body ){
        return res.status(200).json({ message: "Internal Error.", done:false});
    }
    
    const new_gender = req.body.Gender;
    const new_login = req.body.Login;
    const new_fname = req.body.Firstname;
    const new_lname = req.body.Name;
    const new_mail = req.body.Email ;
    const new_PP = req.body.Profile_picture;
    const new_job = req.body.Job;

    try{
        const query = "SELECT login, mail, score FROM user WHERE ID=? ";
        const response = await queryPromise(query, [user_ID]);
            // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
            //          -> fonctionne avec async

        // ERROR case
        if (response.length > 1){
            var err_msg = "ERREUR : plusieurs utilisateurs avec le meme ID ont ete trouves dans la table user.";
            console.error(err_msg);
            return res.status(200).json({ message: "Internal Error.", done:false});
        }
        // ERROR case
        else if (response.length == 0) {
            var err_msg = "ERREUR : aucun utilisateur trouvé dans la table user.";
            console.error(err_msg);
            return res.status(200).json({ message: "Internal Error.", done:false});
        }

        if(new_mail != response[0].mail){
            return res.status(200).json({ message: "Vous ne pouvez pas changer votre adresse mail.", done:false});
        }
        


        if (new_login != response[0].login){

            const query_0 = "SELECT login FROM user WHERE BINARY login = ?";
                // BINARY : permet de tenir compte de la casse des caracteres
            const response_0 = await queryPromise(query_0, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
            
            if (response_0.length > 0){
                error_msg = "Le login " + new_login + " est déjà pris par un autre utilisateur !";
                return res.status(200).json({ message: error_msg, done:false});
            }

            const query_1= `UPDATE user
                            SET login = ?
                            WHERE ID = ?`;
            const response_1 = await queryPromise(query_1, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
        }

        score = response[0].score;
        new_score = score + 50;

        let profilePicUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);

            const filePath = path.join(__dirname, '../../uploads/', req.file.filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });

            profilePicUrl = result.secure_url;
            const query_2= `UPDATE user
                        SET profile_picture = ?
                        WHERE ID = ?`;

            const response_2 = await queryPromise(query_2, [profilePicUrl, req.session.user_id]);
        }
    

        const query_2= `UPDATE user
                        SET first_name = ?, last_name = ?, gender = ?, job = ?, score = ?
                        WHERE ID = ?`;
        const response_2 = await queryPromise(query_2, [new_fname, new_lname, new_gender, new_job, new_score, req.session.user_id]);
            // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
            //          -> fonctionne avec async
            return res.status(200).json({ message: "Vos données ont été changées avec succès", done:true});
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        return res.status(200).json({ message: "Internal", done:false});
    }
});


module.exports = router;
