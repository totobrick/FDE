const express = require('express');
const router = express.Router();
const {isConnected} = require("./isConnected.js");

router.get('/homepage', (req, res) => {
    console.log("\nPage : /homepage");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
    if(! isConnected(req)){
        console.log("User not connected, redirection to : /index");
        return res.redirect('/index');
    };
    console.log("User connected.");
    res.render("index", { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            welcome_msg: "Bienvenue " + req.session.login + ".",
                            account_menu : true});
});

module.exports = router;
