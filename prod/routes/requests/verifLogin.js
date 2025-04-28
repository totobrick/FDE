const express = require('express');
const sql = require('mysql2');
const router = express.Router();
const {queryPromise} = require("./../functions/functions.js");
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();


router.post('/requests/verifLogin', upload.none(), async (req, res) => {
    const login = req.body.login;   //name of the input field
    const pwd = req.body.password;  //name of the input field

    try {
        const query = "SELECT ID, isValidated, isSuperAdmin, password FROM user WHERE BINARY login=?";
        const response = await queryPromise(query, [login]);

        // Un utilisateur trouvé dans la database
        if (response.length == 1){
            
            const match = await bcrypt.compare(pwd, response[0].password);

            if(!match) {
                return res.status(200).json({ message: "Mauvais mot de passe."});
            }

            // Vérifie si le compte a été validé par le superAdministrateur
            if (response[0].isValidated == 0){
                return res.status(200).json({ message: "Votre compte n'a pas encore été validé par l'Administrateur. Un peu de patience ..."});
            }

            // Enregistre si l'utilisateur est un superAdmin
            if (response[0].isSuperAdmin != 0) {
                req.session.isSuperAdmin = "1";
            }

            // Variables de session utilisateur
            req.session.user_id = response[0].ID;
            req.session.login = login;
            //req.session.password = pwd;
            req.session.connection_time = Date.now();
            req.session.cache_buster = Date.now();

            if (! req.session.login){
                return res.status(200).json({ message: "Internal Error."});
            }

            return res.status(200).json({ redirect: "/homepage"});
        }
        else if (response.length >= 2){
            console.log("Erreur anormal : 2 utilisateurs possèdent le même login et mot de passe.");
            return res.status(200).json({ message: "Internal Error."});
        }
        else{
            return res.status(200).json({ message: "Utilisateur introuvable."});
        }
    }
    catch (err) {
        console.error(err);
        return res.status(200).json({ message: "Internal Error."});
    }
});

module.exports = router;