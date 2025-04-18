const express = require('express');
const router = express.Router();

router.get('/homepage', (req, res) => {
    res.render("index", { loginBtn: "Se déconnecter",
    path_loginBtn: "/logout",
    welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + ".",
    account_menu : "yes"});
});

module.exports = router;
