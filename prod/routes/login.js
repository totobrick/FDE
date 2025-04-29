const express = require('express');
const router = express.Router();
const {isConnected} = require("./functions/functions.js");

router.get('/login', (req, res) => {

  // Get error_msg in session var and delete session var content
  const error_msg = req.session.error_msg;
  delete req.session.error_msg;

  if(isConnected(req)){
    return res.redirect(301, '/homepage');
  };
  
  res.render("login", { loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          error_msg: error_msg});
});

module.exports = router;
