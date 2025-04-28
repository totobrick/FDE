const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./../functions/functions.js");
const multer = require('multer');
const upload = multer();

router.post('/registerModificationAccount', upload.none(), async (req, res) => {


    const user_ID = req.session.user_id;

    if(!user_ID) {
        return res.status(200).json({redirect:"/index"});
    }

    // if form not submitted
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
            console.log("L'utilisateur veut changer d'adresse mail !");
            return res.status(200).json({ message: "Vous ne pouvez pas changer votre adresse mail.", done:false});
        }
        

        console.log("Pas de changement de mail.");

        // Login changes
        if (new_login != response[0].login){
            // Check if new login does not exist in database
            const query_0 = "SELECT login FROM user WHERE BINARY login = ?";
                // BINARY : permet de tenir compte de la casse des caracteres
            const response_0 = await queryPromise(query_0, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
            
            // Login incorrect : it exists in database
            if (response_0.length > 0){
                error_msg = "Le login " + new_login + " est déjà pris par un autre utilisateur !";
                console.log(error_msg);
                return res.status(200).json({ message: error_msg, done:false});
            }

            // Login is valid
            const query_1= `UPDATE user
                            SET login = ?
                            WHERE ID = ?`;
            const response_1 = await queryPromise(query_1, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
        }

        score = response[0].score;
        new_score = score + 100;

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
