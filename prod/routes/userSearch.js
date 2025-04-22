const express = require('express');
const router = express.Router();
const {isConnected} = require("./functions/functions.js");

router.get('/userSearch', (req, res) => {
    console.log("\nPage : /userSearch");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
    if(! isConnected(req)){
        console.log("User not connected, redirection to : /index");
        return res.redirect('/index');
    };
    console.log("User connected.");
    res.render("userSearch", { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            welcome_msg: "Bienvenue " + req.session.login + ".",
                            account_menu : true});
});

module.exports = router;
