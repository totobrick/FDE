const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const {addPoints, isConnected} = require("./functions/functions.js");

const dbConfig = {
    host: 'localhost',
    user: 'root',     
    password: '',
    database: 'fde_database'     
  };

router.post('/delete', async (req, res) => {
    const id = req.body.ID;

    if(!isConnected(req)){
        console.log("User not connected, redirection to : /homepage");
        return res.redirect(301, '/homepage');
    };
    let connection;
    connection = await mysql.createConnection(dbConfig);

    await connection.query(`DELETE FROM connected_object WHERE ID = ?`, [id])
    
    try {
        await addPoints(req.session.user_id, 100); 
    } catch (err) {
        console.error("Erreur lors de l'ajout de points :", err);
        res.status(500).send("Erreur lors de l'ajout des points");
    }

    res.json({ redirectUrl: '/objectSearch' });
});

module.exports = router;
