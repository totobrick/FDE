const express = require('express');
const router = express.Router();
const {isConnected, isSuperAdmin} = require("./functions/functions.js");

router.get('/admin', async (req, res) => {
    console.log("\nPage : /admin");
    console.log("Variables de session : ", req.session);

    // Check user is connected
    if(! isConnected(req)){
        console.log("User not connected, redirection to : /index");
        return res.redirect('/index');
    };

    if(! isSuperAdmin(req)){
        req.session.error_msg = "Vous n'êtes pas superAdmin, seuls les superAdmin ont accès à cette page.";
        console.log(req.session.error_msg);
        return res.redirect(301, '/homepage');
    }

    // Get error_msg in session var and delete session var content
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;

    res.render("admin", { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            account_menu : true,
                            error_msg});
});

module.exports = router;
