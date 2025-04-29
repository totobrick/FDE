const express = require('express');
const axios = require('axios');
/*const {isConnected} = require("./functions/functions.js");
const { addPoints } = require('./functions/functions.js');
const { checkUserLevel } = require('./functions/functions.js');*/
const { isConnected,addPoints, checkUserLevel, queryPromise } = require("./functions/functions.js");
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',
    database: 'fde_database'  
});

router.get('/centralCreation', async (req, res) => {
    console.log("\nPage : /centralCreation");
    console.log("Variables de session : ", req.session);
  
    if (!isConnected(req)) {
      console.log("User not connected, redirection to : /index");
      return res.redirect('/index');
    }
  
    try {
      const userId = req.session.user_id;
      const level = await checkUserLevel(userId);
  
      if (level !== 3) {
        console.log("Niveau insuffisant : accès refusé.");
        return res.redirect('/index');
      }
  
      const sql = 'SELECT ID, name FROM region';
      const regions = await queryPromise(sql);
  
      console.log("User connected.");
      res.render("centralCreation", {
        loginBtn: "Se déconnecter",
        path_loginBtn: "/logout",
        welcome_msg: "Bienvenue " + req.session.login + ".",
        account_menu: true,
        regions: regions
      });
  
    } catch (err) {
      console.error("Erreur serveur :", err);
      res.status(500).send("Erreur serveur");
    }
  });
  
router.post('/submit_form', async (req, res) => {
    const { Nom, Région, Lien, Clé } = req.body;

    try {
        var response;
        try {
            response = await axios.get(`${Lien}/getInfo`, {
                headers: { Authorization: Clé}
            });

        } catch (error) {
            return res.status(500).json({
                message: 'Error processing the request',
                error: error.message
            });
        }

        
        const sql = 'INSERT INTO connected_object (name, id_region, link, Apikey, type) VALUES (?, ?, ?, ?, "production")';
        db.query(sql, [Nom, Région, Lien, Clé], async (err, result) => {
            if (err) {
                console.error("Erreur d'insertion : ", err);
                return res.status(500).send('Erreur lors de l\'enregistrement.');
            }

            try {
                await addPoints(req.session.user_id, 100); 
            } catch (error) {
                console.error('Erreur lors de l\'ajout des points : ', error);
            }

            var id_type;
            db.query("SELECT id FROM production_type WHERE type_name=?", [response.data.type], async (err, result_) => {
                if (err) {
                    console.error("Erreur d'insertion : ", err);
                    return res.status(500).send('Erreur lors de l\'enregistrement.');
                }

                id_type = result_[0].id;

                db.query("INSERT INTO power_source (ID_object, type, max_prod, min_prod) VALUES (?, ?, ?, ?);", [result.insertId, id_type, response.data.max_prod, response.data.min_prod], async (err, result_) => {
                    if (err) {
                        console.error("Erreur d'insertion : ", err);
                        return res.status(500).send('Erreur lors de l\'enregistrement.');
                    }


                });
                
            });
        });
    } catch (error) {
        return res.status(500).send('Internal Error.');
    }

    return res.redirect("/centralCreation");
});

module.exports = router;