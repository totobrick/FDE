const express = require('express');
const router = express.Router();
const {isConnected} = require("./isConnected.js");

router.get('/login', (req, res) => {
  console.log("\nPage : /login");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
  if(isConnected(req)){
    console.log("User connected, redirection to : /homepage AAA");
    return res.redirect(301, '/homepage');
};
console.log("User not connected.");
  res.render("login", { loginBtn: "Se connecter",
                          path_loginBtn: "/login"});
});

module.exports = router;
