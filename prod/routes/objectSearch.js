const express = require('express');
const router = express.Router();
const {isConnected} = require("./functions/functions.js");

router.get('/objectSearch', (req, res) => {
    if(! isConnected(req)){
        return res.redirect('/index');
    };
    res.render("objectSearch", { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            welcome_msg: "Bienvenue " + req.session.login + ".",
                            account_menu : true});
});

module.exports = router;