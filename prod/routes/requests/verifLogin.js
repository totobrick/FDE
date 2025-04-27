const express = require('express');
const sql = require('mysql2');
const router = express.Router();
const {queryPromise} = require("./../functions/functions.js");



router.post('/requests/verifLogin', async (req, res) => {
    console.log("\nPage : /verifLogin");

    const login = req.body.login;   //name of the input field
    const pwd = req.body.password;  //name of the input field
    // try/catch : used in case of failure for the database connection or bad request
    try {
        const query = "SELECT ID, isValidated, isSuperAdmin FROM user WHERE BINARY login=? AND BINARY password=?";
        const response = await queryPromise(query, [login, pwd]);
        
        console.log("Nb lignes : ", response.length);
        console.log("response", response);

        // Un utilisateur trouvé dans la database
        if (response.length == 1){
            console.log("RESPONSE : ", response);

            // Vérifie si le compte a été validé par le superAdministrateur
            if (response[0].isValidated == 0){
                req.session.error_msg = "Votre compte n'a pas encore été validé par l'Administrateur. Un peu de patience ...";
                console.log(req.session.error_msg);
                return res.redirect(301, '/login');
            }

            // Enregistre si l'utilisateur est un superAdmin
            if (response[0].isSuperAdmin != 0){
                console.log("response[0].isSuperAdmin = ", response[0].isSuperAdmin);

                // l'utilisateur est un superAdmin
                req.session.isSuperAdmin = "1";
                console.log("req.session.isSuperAdmin = ", req.session.isSuperAdmin);
            }

            // Variables de session utilisateur
            req.session.user_id = response[0].ID;
            req.session.login = login;
            //req.session.password = pwd;
            req.session.connection_time = Date.now();
            req.session.cache_buster = Date.now();

            if (! req.session.login){
                console.log("LOGIN : Pas de variable de session.");
                return;
            }

            console.log("LOGIN : variable de session existante.");
            return res.redirect(301, "/homepage");        // 301 : http status for permanent redirection
        }
        else if (response.length >= 2){
            console.log("Erreur anormal : 2 utilisateurs possèdent le même login et mot de passe.");
            req.session.error_msg = "Erreur anormal : 2 utilisateurs possèdent le même login et mot de passe.";
            return res.redirect("/login");
        }
        else{
            console.log("Login ou mot de passe incorrect !");
            req.session.error_msg = "Login ou mot de passe incorrect !";
            return res.redirect("/login");
        }
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;