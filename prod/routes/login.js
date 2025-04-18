const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render("login", { loginBtn: "Se connecter",
                          path_loginBtn: "/login"});
});

module.exports = router;
