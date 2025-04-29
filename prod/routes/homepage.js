const express = require('express');
const router = express.Router();
const {isConnected} = require("./functions/functions.js");

router.get('/homepage', (req, res) => {
  userConnected = isConnected(req);

    if(!userConnected){
        return res.redirect('/index');
    };

    // Get error_msg in session var and delete session var content
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;

    res.render("index", { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            welcome_msg: "Bienvenue " + req.session.login + ".",
                            account_menu : true, 
                            userConnected : true,
                            error_msg});
});

module.exports = router;
