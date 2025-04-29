const express = require('express');
const axios = require('axios');
const { isConnected,addPoints, checkUserLevel, queryPromise } = require("./functions/functions.js");
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const upload = multer();
const { promisify } = require('util');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',     
    password: '',
    database: 'fde_database'  
});

const query = promisify(db.query).bind(db);

router.get('/centralCreation', async (req, res) => {
 
    if (!isConnected(req)) {
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
  
      res.render("centralCreation", {
        loginBtn: "Se déconnecter",
        path_loginBtn: "/logout",
        welcome_msg: "Bienvenue " + req.session.login + ".",
        account_menu: true,
        regions: regions
      });
  
    } catch (err) {
      res.status(500).send("Erreur serveur");
    }
  });
  
  router.post('/centralCreationRequest', upload.none(), async (req, res) => {
    const { Nom, Region, Lien, Cle } = req.body;

    if (!Nom || !Region || !Lien || !Cle) {
        return res.status(400).json({ message: "Veuillez remplir tous les champs.", done: false });
    }

    try {
        let response;
        try {
            response = await axios.get(`${Lien}/getInfo`, {
                headers: { Authorization: Cle }
            });
        } catch (error) {
            return res.status(400).json({ message: "Impossible de se connecter à l'API. Veuillez vérifier le lien.", done: false });
        }

        const existing = await query('SELECT name FROM connected_object WHERE name = ?', [Nom]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Ce nom est déjà utilisé.", done: false });
        }

        const result = await query(
            'INSERT INTO connected_object (name, id_region, link, Apikey, type) VALUES (?, ?, ?, ?, "production")',
            [Nom, Region, Lien, Cle]
        );

        try {
            await addPoints(req.session.user_id, 100);
        } catch (err) {
            console.error('Erreur lors de l\'ajout des points :', err);
        }

        const typeResult = await query('SELECT id FROM production_type WHERE type_name = ?', [response.data.type]);
        if (typeResult.length === 0) {
            return res.status(500).json({ message: "Type de production inconnu.", done: false });
        }

        const id_type = typeResult[0].id;

        await query(
            'INSERT INTO power_source (ID_object, type, max_prod, min_prod) VALUES (?, ?, ?, ?)',
            [result.insertId, id_type, response.data.max_prod, response.data.min_prod]
        );

        return res.status(200).json({ message: "La centrale a bien été ajoutée.", done: true });

    } catch (error) {
        console.error("Erreur globale :", error);
        return res.status(500).json({ message: "Erreur interne.", done: false });
    }
});

module.exports = router;