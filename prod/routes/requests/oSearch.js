const express = require('express');
const sql = require('mysql2');
const router = express.Router();

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database',
});

router.post('/oSearch', (req, res) => {
    console.log('BODY:', req); 
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Merci d'entrer un nom" });
    }

    const query = 'SELECT * FROM connected_object WHERE name LIKE ?';
    connection.query(query, ["%" + name + "%"], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: "Une erreur s'est produite. Veuillez réessayer plus tard." });
        }

        if (results.length > 0) {
            return res.json(results); // ✅ renvoie les données au frontend
        } else {
            return res.status(404).json({ error: 'Aucun objet trouvé.' });
        }
    });
});

module.exports = router;