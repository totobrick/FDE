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

router.get('/central', (req, res) => {
  const objectId = req.query.id;

  if (!objectId) {
      return res.redirect('/');
  }

  if(!isConnected(req)){
    console.log("User not connected, redirection to : /homepage");
    return res.redirect(301, '/homepage');
  };

  db.query('SELECT * FROM connected_object WHERE ID = ?', [objectId], (err, results) => {
      if (err || results.length === 0) {
        console.log("ERROR")
          return res.redirect('/');
      }
      const obj = results[0];
      res.render('central', { obj,
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
