const express = require('express');
const sql = require('mysql2');
const router = express.Router();



router.post('/requests/verifLogin', (req, res) => {
    console.log("\nPage : /verifLogin");

    // Create connection to database
    const connection = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });


    console.log("Formulaire login recu.");
    const login = req.body.login;   //name of the input field
    const pwd = req.body.password;  //name of the input field

    const query = "SELECT ID, isValidated FROM user WHERE login=? AND password=?";
    connection.query(query, [login, pwd], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
        }
        console.log("Nb lignes : ", response.length);
        console.log("response", response);

        // Un utilisateur trouvé dans la database
        if (response.length == 1){
            console.log("RESPONSE : ", response);
            // Vérifie si le compte a été validé par le superAdministrateur
            if (response[0].isValidated == 0){
                req.session.error_msg = "Votre compte n'a pas encore été validé par l'Administrateur. Un peu de patience ...";
                console.log(req.session.error_msg);
                return res.redirect(301, '/');
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
            else{
                console.log("LOGIN : variable de session existante.");
            }
            res.redirect(301, "/homepage");        // 301 : http status for permanent redirection
        }
        else if (response.length >= 2){
            console.log("Erreur anormal : 2 utilisateurs possèdent le même login et mot de passe.");
            req.session.error_msg = "Erreur anormal : 2 utilisateurs possèdent le même login et mot de passe.";
            res.redirect("/login");
        }
        else{
            console.log("Login ou mot de passe incorrect !");
            req.session.error_msg = "Login ou mot de passe incorrect !";
            res.redirect("/login");
        }
    });
});

module.exports = router;