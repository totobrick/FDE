const express = require('express');
const router = express.Router();
const {isConnected, isSuperAdmin, queryPromise} = require("./functions/functions.js");

router.get('/admin', async (req, res) => {
    // Check user is connected
    if(! isConnected(req)){
        return res.redirect('/index');
    };

    if(! isSuperAdmin(req)){
        req.session.error_msg = "Vous n'êtes pas superAdmin, seuls les superAdmin ont accès à cette page.";
        return res.redirect(301, '/homepage');
    }
    
    // Si une recherche de profil est faite (on y va 100% du temps)
    if( req.query.keyword ) {
        // Récupération du mot-clé de recherche
        const keyword = req.query.keyword;
        const keyword_2 =  '%' + keyword + '%';

        // Si pas de recherche effectuée (1er chargement de page)
        if (keyword == 'undefined'){
            const sql = `SELECT * FROM user WHERE isValidated = 0 ORDER BY ID ASC`;
            const user_list = await queryPromise(sql, []);

            // Get error_msg in session var and delete session var content
            const error_msg = req.session.error_msg;
            delete req.session.error_msg;

            return res.render("admin", { loginBtn: "Se déconnecter",
                                    path_loginBtn: "/logout",
                                    account_menu : true,
                                    error_msg,
                                    user_list});
        }


        

        // Recherche de profils correspondant à la recherche (on recherche dans pseudo, nom, prénom ...)
        /*const sql = `SELECT * FROM user WHERE Genre LIKE ?
                    OR Preference LIKE ?
                    OR Pseudo LIKE ?
                    OR Profession LIKE ?
                    OR Nom LIKE ?
                    OR Prénom LIKE ?
                    OR Email LIKE ?
                    OR ID LIKE ?`;*/
        const sql = `SELECT * FROM user WHERE isValidated = 0
                        AND ( ID = ?
                        OR login LIKE ? )
                        ORDER BY ID ASC`;
        const user_list = await queryPromise(sql, [keyword, keyword_2]);

        // Get error_msg in session var and delete session var content
        const error_msg = req.session.error_msg;
        delete req.session.error_msg;

        return res.render("admin", { loginBtn: "Se déconnecter",
                                path_loginBtn: "/logout",
                                account_menu : true,
                                error_msg,
                                user_list});
    }
    // Sinon : affichage de tous les profils
    else {
        // Requête SQL pour récupérer les profils (et infos liées)
        const sql = "SELECT * FROM user WHERE isValidated = 0 ORDER BY ID ASC";
        const user_list = await queryPromise(sql, []);

        // Get error_msg in session var and delete session var content
        const error_msg = req.session.error_msg;
        delete req.session.error_msg;

        return res.render("admin", { loginBtn: "Se déconnecter",
                                path_loginBtn: "/logout",
                                account_menu : true,
                                error_msg,
                                user_list});
    }

    
});

module.exports = router;
