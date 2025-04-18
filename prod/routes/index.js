const express = require('express');
const router = express.Router();

router.get('/index', (req, res) => {
  res.render("index", { loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          welcome_msg: ""
                        });
});

module.exports = router;
