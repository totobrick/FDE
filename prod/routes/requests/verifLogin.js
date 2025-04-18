const express = require('express');
const sql = require('mysql2');
const router = express.Router();



router.post('/requests/verifLogin', (req, res) => {
    const connection = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });


    console.log("Formulaire login recu.");
    const login = req.body.login;   //name of the input field
    const pwd = req.body.password;  //name of the input field
    console.log(`login: ${login},\npwd : ${pwd}.`);

    const query_1 = "SELECT ID FROM user WHERE login=? AND password=?";
    connection.query(query_1, [login, pwd], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
        }
        console.log(response);
        console.log("ID : " + response[0].ID);
        console.log("Nb lignes : ", response.length);

        if (response.length == 1){
            console.log(`Bonjour ${login}, vous êtes connecté.`);
            req.session.user_id = response[0].ID;
            req.session.login = login;
            req.session.password = pwd;
            req.session.connection_time = Date.now();
            req.session.cache_buster = Date.now();

            if (! req.session.login){
                console.log("LOGIN : Pas de variable de session.");
                return;
            }
            else{
                console.log("LOGIN : variable de session existante.");
            }
            if (! req.session.password){
                console.log("PASSWORD : Pas de variable de session.");
                return;
            }
            else{
                console.log("PASSWORD : variable de session existante.");
            }
            res.redirect(301, "/homepage");        // 301 : http status for permanent redirection
        }
        else{
            res.send("Non connecté.");
        }
    });
});

module.exports = router;