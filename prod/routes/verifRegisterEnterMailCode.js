const express = require('express');
const router = express.Router();
const {isConnected} = require("./isConnected.js");

router.get('/verifRegisterEnterMailCode', (req, res) => {
    console.log("\nPage : /verifRegisterEnterMailCode");
    console.log("Variables de session : ", req.session);

    // Get error_msg in session var and delete session var content
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;

    if(isConnected(req)){
        console.log("User connected, redirection to : /homepage");
        return res.redirect(301, '/homepage');
    };
    
    res.render("verifRegisterEnterMailCode", { loginBtn: "Se connecter",
                            path_loginBtn: "/login",
                            error_msg
                        });
});

module.exports = router;
