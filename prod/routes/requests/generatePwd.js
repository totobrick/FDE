/*  This page generates and inserts in the database the new password of the user.
    In the next page, the password is sent by email.
*/
const express = require('express');
const router = express.Router();
const {isConnected, queryPromise, generatePassword, hashPassword} = require("./../functions/functions.js");

router.get('/generatePwd', async (req, res) => {
    console.log("\nPage : /generatePwd");
    console.log("req.session : ", req.session);

    // try/catch : used in case of failure for the database connection or bad request
    try{
        if(isConnected(req)){
            console.log("User connected, redirection to : /homepage");
            return res.redirect(301, '/homepage');
        };
        if( ! req.session.TMP_user_id || ! req.session.TMP_login || ! req.session.TMP_mail){
            req.session.error_msg = "Variables de session pour la génération du mot de passe ou l'envoi du mail inexistantes.";
            console.error(req.session.error_msg);
            return res.redirect(301, '/');
        }

        const user_id = req.session.TMP_user_id;
        const new_pwd = await generatePassword();
        const new_pwd_hashed = await hashPassword(new_pwd);
        console.log("new_pwd : ", new_pwd);
        console.log("new_pwd_hashed : ", new_pwd_hashed);

        // Check if login exists in database
        const query = "UPDATE user SET password = ? WHERE ID = ?";   // BINARY : impose le respect de la casse
        await queryPromise(query, [new_pwd_hashed, user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async

        
        req.session.TMP_pwd = new_pwd;
        // Send email with password
        return res.redirect(301, "/send_mail_forgot_pwd");        // 301 : http status for permanent redirection
    }

    catch(err){
        console.error("Erreur dans la génération du mot de passe ou de sa mise en base de données :", err);
        return null;
    }
});

module.exports = router;
    