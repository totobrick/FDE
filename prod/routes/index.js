const express = require('express');
const router = express.Router();
const {isConnected} = require("./isConnected.js");

//const isConnected = require('./isConnected.js');

router.get('/index', (req, res) => {
    console.log("\nPage : /index");
    console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
  if(isConnected(req)){
    console.log("User connected, redirection to : /homepage");
    return res.redirect(301, '/homepage');
  };
  console.log("User not connnected.");
  res.render("index", { loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          welcome_msg: "",
                          account_menu : false
                        });
});

module.exports = router;
