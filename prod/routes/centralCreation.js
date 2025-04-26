const express = require('express');
const {isConnected} = require("./functions/functions.js");
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',
    database: 'fde_database'  
});

router.get('/centralCreation', (req, res) => {
    console.log("\nPage : /centralCreation");
    console.log("Variables de session : ", req.session);
      if(! isConnected(req)){
          console.log("User not connected, redirection to : /index");
          return res.redirect('/index');
      };

    const sql = 'SELECT ID, name FROM region'; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des régions : ", err);
            return res.status(500).send('Erreur serveur');
        }
    
      console.log("User connected.");
      res.render("centralCreation", { loginBtn: "Se déconnecter",
                                    path_loginBtn: "/logout",
                                    welcome_msg: "Bienvenue " + req.session.login + ".",
                                    account_menu : true,
                                    regions : results
        });
    });
});

router.post('/submit_form', (req, res) => {
    const { Nom, Région, Lien, Clé } = req.body;
    const sql = 'INSERT INTO connected_object (name, id_region, link, Apikey, type) VALUES (?, ?, ?, ?, "production")';
    db.query(sql, [Nom, Région, Lien, Clé], (err, result) => {
        if (err) {
            console.error("Erreur d'insertion : ", err);
            return res.status(500).send('Erreur lors de l\'enregistrement.');
        }
        res.send('Données enregistrées avec succès !');
    });
});



module.exports = router;
