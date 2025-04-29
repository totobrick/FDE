const sql = require('mysql2');
const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./functions/functions.js");



router.post('/verifRegister', async (req, res) => {
    // try/catch : used in case of failure for the database connection or bad request
    try{
        console.log("\nPage : /verifRegister");

        // Check if user is connected
        if(isConnected(req)){
            return res.redirect(301, '/homepage');
        };

        // Vérification login unique
        const query = "SELECT ID FROM user WHERE BINARY login=?";
        const response = await queryPromise(query, [req.body.Login]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async

        if (response.length > 0){
            req.session.error_msg = "Le login " + req.body.Login + " est déjà utilisé, veuillez en choisir un autre.";
            console.error(req.session.error_msg);
            return res.redirect(301, "/register");        // 301 : http status for permanent redirection
        }

        const code = Math.floor(Math.random() * 900000000000) + 100000000000;

        req.session.gender = req.body.Gender;         //name of the input field
        req.session.fname = req.body.Firstname;       //name of the input field
        req.session.lname = req.body.Name;            //name of the input field
        req.session.region = req.body.Region;         //name of the input field
        req.session.date_birth = req.body.Date_birth; //name of the input field
        req.session.mail = req.body.Email;            //name of the input field
        req.session.login = req.body.Login;           //name of the input field
        req.session.pwd = req.body.Password;          //name of the input field
        req.session.code = code;

        return res.redirect(301, '/send_registerMailCode');
        //return res.redirect(301, '/verifRegisterEnterMailCode');
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
