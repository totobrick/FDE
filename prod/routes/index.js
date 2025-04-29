const express = require('express');
const router = express.Router();
const {isConnected, superAdmin_mails} = require("./functions/functions.js");


router.get('/index', (req, res) => {
  console.log("\nPage : /index");
  const userConnected = isConnected(req);

  if(userConnected){
    return res.redirect(301, '/homepage');
  }

  // Get error_msg in session var and delete session var content
  const error_msg = req.session.error_msg;
  delete req.session.error_msg;

  res.render("index", { loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          welcome_msg: "",
                          account_menu : false,
                          userConnected : false,
                          error_msg
                        });
});

module.exports = router;
