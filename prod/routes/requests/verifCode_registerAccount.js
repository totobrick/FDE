const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./../functions/functions.js");
const bcrypt = require('bcrypt');


// Hashing function
async function hashPassword(password) {
    const saltRounds = 10;  // You can adjust this as needed
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      return hash;
    } catch (err) {
      console.error('Error hashing password:', err);
      return ""
    }
  }

router.post('/verifCode_registerAccount', async (req, res) => {

    // try/catch : used in case of failure for the database connection or bad request
    try{
        if(isConnected(req)){
            return res.redirect(301, '/homepage');
        };

        // Données utilisateur
        const user_gender = req.session.gender;
        const user_fname = req.session.fname;
        const user_lname = req.session.lname;
        const user_date = req.session.date_birth;
        const user_mail = req.session.mail;
        const user_region = req.session.region;
        const user_login = req.session.login;
        const user_pwd = await hashPassword(req.session.pwd);
        const user_code = req.body.Code;
        const code = req.session.code;

        // Check si le code entré est correct
        if (user_code == code){
            // Code correct

            // Suppresion des variables de session
            // (les autres seront supprimés dans send_mail_verifAdmin.js)
            delete req.session.pwd;
            delete req.session.code;

            // Vérification login unique
            const query = "SELECT ID FROM user WHERE BINARY login=?";
            const response = await queryPromise(query, [user_login]);
                    // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                    //          -> fonctionne avec async

            if (response.length > 0){
                req.session.error_msg = "Le login " + user_login + " vient d'être pris par quelqu'un d'autre. Veuillez en choisir un autre.";
                console.error(req.session.error_msg);
                return res.redirect(301, "/register");        // 301 : http status for permanent redirection
            }

            // Insertion de l'utilisateur
            const query_2 = "INSERT INTO user (login, password, first_name, last_name, date_of_birth, mail, id_region, gender) VALUES (?,?,?,?,?,?,?,?)";
            await queryPromise(query_2, [user_login, user_pwd, user_fname, user_lname, user_date, user_mail, user_region, user_gender]);
                    // await :  -> attend la fin de l'execution de la fct pour passer a la suite
                    //          -> fonctionne avec async
            
            req.session.error_msg = "Votre compte a été créé avec succès ! Veuillez attendre que l'Administrateur vous accepte.";
            // Envoi du mail au superAdmin pour qu'il valide le compte
            // En attendant le compte est enregistré mais l'utilisateur ne peut pas se connecter.
            return res.redirect(301, '/send_mail_verifAdmin');
        }
        else {
            req.session.error_msg = "Code entré incorrect.";
            console.error(req.session.error_msg);
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
