const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { isConnected } = require('./functions/functions.js');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fde_database',
};

router.get('/profile', async (req, res) => {
  const userId = req.query.user;

  if (!userId) {
    return res.redirect('/');
  }

  if (!isConnected(req)) {
    return res.redirect(301, '/homepage');
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute('SELECT * FROM user WHERE ID = ?', [userId]);
    let [region] = await connection.query(`SELECT r.name 
      FROM region r, user u
      WHERE u.ID = ?
      AND r.ID = u.id_region`, [userId]);

    if (rows.length === 0) {
      return res.redirect('/');
    }

    const user = rows[0];
    const reg = region[0];

    res.render('profile', {
      user,
      reg,
      loginBtn: "Se connecter",
      path_loginBtn: "/login",
      welcome_msg: "",
      account_menu: true,
      userConnected: true,
      error_msg: ""
    });

  } catch (err) {
    console.error('Erreur lors de la récupération du profil :', err);
    res.status(500).send('Erreur serveur');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;
