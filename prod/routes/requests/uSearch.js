const express = require('express');
const sql = require('mysql2');
const router = express.Router();
const { addPoints } = require('../functions/functions.js');

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database',
});

router.post('/uSearch', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Merci d'entrer un nom" });
    }

    const query = 'SELECT * FROM user WHERE login LIKE ?';
    connection.query(query, ["%" + username + "%"], async (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: "Une erreur s'est produite. Veuillez réessayer plus tard." });
        }
        if (results.length > 0) {
            try {
                await addPoints(req.session.user_id, 50); 
            } catch (error) {
                console.error('Erreur lors de l\'ajout des points : ', error);
            }
            return res.json(results); 
        } else {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé.' });
        }
    });
});

module.exports = router;