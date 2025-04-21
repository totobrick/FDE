const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./functions/functions.js");

router.post('/checkLoginExists', async (req, res) => {

    // try/catch : used in case of failure for the database connection or bad request
    try{
        console.log("\nPage : /checkLoginExists");

        if(isConnected(req)){
            console.log("User connected, redirection to : /homepage");
            return res.redirect(301, '/homepage');
        };

        const login = req.body.Login;

        // Check if login exists in database
        const query = "SELECT ID FROM user WHERE BINARY login=?";   // BINARY : impose le respect de la casse
        const response = await queryPromise(query, [login]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async

        console.log("Nb lignes : ", response.length);

        if (response.length == 1){
            console.log("Login correct : " + login);

            // Get password
            const query_2 = "SELECT ID, password, mail FROM user WHERE BINARY login=?"; // BINARY : impose le respect de la casse
            const response_2 = await queryPromise(query_2, [login]);
            req.session.TMP_user_id = response_2[0].ID;
            req.session.TMP_login = login;
            req.session.TMP_pwd = response_2[0].password;
            req.session.TMP_mail = response_2[0].mail;

            // Send email with password
            return res.redirect(301, "/send_mail_forgot_pwd");        // 301 : http status for permanent redirection
        }
        // Login does not exist
        else if (response.length == 0){
            req.session.error_msg = "Aucun utilisateur ne possède le login : " + login + ".";
            console.log(req.session.error_msg);
            return res.redirect(301, '/forgot_pwd');
        }
        // ERROR : more than 1 login found
        else {
            req.session.error_msg = "ERREUR anormale : plusieurs utilisateurs possèdent le login " + login + ".";
            console.error(req.session.error_msg);
            return res.redirect(301, '/forgot_pwd');
        }
    }

    catch(err){
        console.error("Erreur dans checkLoginExists :", err);
        return null;
    }
});

module.exports = router;
