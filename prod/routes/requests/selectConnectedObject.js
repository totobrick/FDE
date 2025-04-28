const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); 

const dbConfig = {
  host: 'localhost',
  user: 'root',     
  password: '',
  database: 'fde_database'     
};

router.get('/data', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query(`
            

            SELECT 
            e.date_need AS date,
            co.name AS connected_object,
            e.electricity_need AS value,
            'consumption' AS type,
            'consumption' AS type2
            FROM electricity_sensor e
            JOIN connected_object co ON e.ID_object = co.id
            HAVING date > UNIX_TIMESTAMP(NOW()) - 300

            UNION ALL

            SELECT 
            p.date_prod AS date,
            co.name AS connected_object,
            p.production AS value,
            'production' AS type,
            pt.type_name AS type2
            FROM production p
            JOIN connected_object co ON p.ID_power_source = co.id
            JOIN power_source pw ON pw.ID_object = p.ID_power_source
            JOIN production_type pt ON pt.ID = pw.type
            HAVING date > UNIX_TIMESTAMP(NOW()) - 300
            

            ORDER BY date ASC;


        `);
        res.json(rows);
    } catch (error) {
      console.error('Erreur MySQL (data route) :', error.message);
      res.status(500).json({ error: 'Erreur lors de la récupération des données de production.' });
    } finally {
      if (connection) await connection.end();
    }
  });



module.exports = router;

