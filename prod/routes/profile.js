const express = require('express');
const router = express.Router();
const sql = require('mysql2');
const {isConnected} = require("./functions/functions.js");

const db = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fde_database',
});

router.get('/profile', (req, res) => {
  const userId = req.query.user;

  if (!userId) {
      return res.redirect('/');
  }

  if(!isConnected(req)){
    console.log("User not connected, redirection to : /homepage");
    return res.redirect(301, '/homepage');
  };

  db.query('SELECT * FROM user WHERE ID = ?', [userId], (err, results) => {
      if (err || results.length === 0) {
        console.log("ERROR")
          return res.redirect('/');
      }
      console.log("IT WENT WELL")
      const user = results[0];
      res.render('profile', { user,
        loginBtn: "Se connecter",
                          path_loginBtn: "/login",
                          welcome_msg: "",
                          account_menu : true,
                          userConnected: true,
                          error_msg : ""
      });
  });
});

module.exports = router;
