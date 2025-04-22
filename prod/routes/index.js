const express = require('express');
const router = express.Router();
const {isConnected} = require("./functions/functions.js");


router.get('/index', (req, res) => {
    console.log("\nPage : /index");
    console.log("Variables de session : ", req.session);
  //console.log("req.session.id : ", req.session.id);

  // Get error_msg in session var and delete session var content
  const error_msg = req.session.error_msg;
  delete req.session.error_msg;

//console.log("req.session.id : ", req.session.id);
  userConnected = isConnected(req);
  if(userConnected){
    console.log("User connected, redirection to : /homepage");
    return res.redirect(301, '/homepage');
  };
  console.log("User not connnected.");
  res.render("index", { loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          welcome_msg: "",
                          account_menu : false,
                          userConnected,
                          error_msg : error_msg
                        });
});

module.exports = router;
