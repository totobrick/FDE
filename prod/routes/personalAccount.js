const express = require('express');
const router = express.Router();
const {isConnected, queryPromise} = require("./functions/functions.js");


router.get('/personalAccount', async (req, res) => {
    // try/catch : used in case of failure for the database connection or bad request
    try{
        // Check user is connected
        if(! isConnected(req)){
            return res.redirect('/index');
        };

        // Get error_msg in session var and delete session var content
        const error_msg = req.session.error_msg;
        delete req.session.error_msg;

        // Get all user datas and show it int the page
        const query = "SELECT ID, login,first_name,last_name, date_of_birth, gender, job, isSuperAdmin,id_region,score,profile_picture,mail FROM user WHERE ID=?";
        const response = await queryPromise(query, [req.session.user_id]);
            // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
            //          -> fonctionne avec async

        if (response.length == 1){
            const user_id = response[0].ID;
            const login = response[0].login;
            const password = response[0].password;
            const f_name = response[0].first_name;
            const l_name = response[0].last_name;
            const date = response[0].date_of_birth;
            const date_birth = date.toLocaleDateString();
            const mail = response[0].mail;
            const region_id = response[0].id_region;
            var profile_picture = response[0].profile_picture;
            const gender = response[0].gender;
            const job = response[0].job;
            const isSuperAdmin = response[0].isSuperAdmin;
            const score = response[0].score;

            // Récupération du nom de région
            const query_2 = "SELECT name FROM region WHERE ID=?";
            const response_2 = await queryPromise(query_2, [region_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async

            if (response_2.length != 1){
                req.session.error_msg = "Un problème a été rencontré dans l'accès à votre région de rattachement !";
                return res.redirect(301, '/homepage');
            }
            const region = response_2[0].name;

            // Photo de profil (ou image par défaut si non existante)
            var has_PP;
            // Pas de photo de profil
            if( profile_picture === ""){
                has_PP = "no";            // has_PP : has profile picture
                profile_picture = "Logos/profile_picture.svg";
            }
            // Avec photo de profil
            else{
                has_PP = "yes";           // has_PP : has profile picture
            }
            var path_profile_picture = profile_picture + "?t=" + req.session.cache_buster;
            
            res.render("personalAccount", { loginBtn: "Se déconnecter",
                                    path_loginBtn: "/logout",
                                    welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + ".",
                                    account_menu : true,
                                    error_msg,

                                    score,
                                    region,
                                    gender,
                                    login,
                                    password,
                                    f_name,
                                    l_name,
                                    date_birth,
                                    mail,
                                    has_PP,
                                    path_profile_picture,
                                    job
                                });

        }
        else if (response.length == 0){
            console.error("ERREUR : aucun utilisateur trouvé dans la table user.");
            console.error("reponse : " + response);
            return;
        }
        else {
            console.error("ERREUR : plusieurs utilisateurs avec le meme ID ont ete trouves dans la table user.");
            console.error("reponse : " + response);
            return;
        }
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;
