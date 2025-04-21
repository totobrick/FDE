const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./../functions/functions.js");

router.post('/verifCode_registerAccount', async (req, res) => {

    // try/catch : used in case of failure for the database connection or bad request
    try{
        console.log("\nPage : /verifCode_registerAccount");

        if(isConnected(req)){
            console.log("User connected, redirection to : /homepage");
            return res.redirect(301, '/homepage');
        };

        // Données utilisateur
        const user_gender = req.session.gender;
        const user_fname = req.session.fname;
        const user_lname = req.session.lname;
        const user_date = req.session.date_birth;
        const user_mail = req.session.mail;
        const user_login = req.session.login;
        const user_pwd = req.session.pwd;
        const user_code = req.body.Code;
        const code = req.session.code;

        console.log("user_gender = " + user_gender);
        console.log("user_fname = " + user_fname);
        console.log("user_lname = " + user_lname);
        console.log("user_date = " + user_date);
        console.log("user_mail = " + user_mail);
        console.log("user_login = " + user_login);
        console.log("user_pwd = " + user_pwd);
        console.log("user_code = " + user_code);
        console.log("code = " + code);

        // Check si le code entré est correct
        if (user_code == code){
            // Code correct
            // Suppresion des variables de session
            delete req.session.gender;
            delete req.session.fname;
            delete req.session.lname;
            delete req.session.date_birth;
            delete req.session.mail;
            delete req.session.login;
            delete req.session.pwd;
            delete req.session.code;

            // Vérification login unique
            const query = "SELECT ID FROM user WHERE BINARY login=?";
            const response = await queryPromise(query, [user_login]);
                    // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                    //          -> fonctionne avec async
            
            console.log("Nb lignes : ", response.length);
            console.log("response", response);

            if (response.length > 0){
                req.session.error_msg = "Le login " + user_login + " vient d'être pris par quelqu'un d'autre. Veuillez en choisir un autre.";
                console.log(req.session.error_msg);
                return res.redirect(301, "/register");        // 301 : http status for permanent redirection
            }

            // Insertion de l'utilisateur
            const query_2 = "INSERT INTO user (login, password, first_name, last_name, date_of_birth, mail, gender) VALUES (?,?,?,?,?,?,?)";
            const response_2 = await queryPromise(query_2, [user_login, user_pwd, user_fname, user_lname, user_date, user_mail, user_gender]);
                    // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                    //          -> fonctionne avec async
            
            req.session.error_msg = "Votre compte a été créé avec succès !";
            console.log(req.session.error_msg);
            return res.redirect(301, '/');
        }
        else {
            req.session.error_msg = "Code entré incorrect.";
            console.log(req.session.error_msg);
            return res.redirect(301, '/verifRegisterEnterMailCode');
        }
    }
    catch(err){
        console.error("Erreur lors de la vérification du code ou lors de l'enregistrement du compte dans la base de données :", err);
        req.session.error_msg = "Erreur : une erreur est survenue lors de la vérification du code ou lors de l'enregistrement du compte dans la base de données. Le compte n'a pas été enregistré.";
        return res.redirect(301, '/register');
    }
});

module.exports = router;
