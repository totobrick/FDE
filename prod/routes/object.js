const express = require('express');
const router = express.Router();
const sql = require('mysql2');
const mysql = require('mysql2/promise');
const {isConnected, checkUserLevel, addPoints} = require("./functions/functions.js");

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database'
};

router.get('/object', async (req, res) => {
    const objectId = req.query.id;
    if (!objectId) return res.redirect('/');

    if (!isConnected(req)) return res.redirect(301, '/index');

    const userId = req.session.user_id;
    const niv = await checkUserLevel(userId);

    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const [data] = await connection.query(`
            SELECT 
                combined.date,
                combined.connected_object,
                combined.value,
                combined.type
            FROM (
                SELECT 
                    e.date_need AS date,
                    co.name AS connected_object,
                    e.electricity_need AS value,
                    'consumption' AS type,
                    co.id AS co_id
                FROM electricity_sensor e
                JOIN connected_object co ON e.ID_object = co.id
                HAVING date > UNIX_TIMESTAMP(NOW()) - 300

                UNION ALL

                SELECT 
                    p.date_prod AS date,
                    co.name AS connected_object,
                    p.production AS value,
                    'production' AS type,
                    co.id AS co_id
                FROM production p
                JOIN connected_object co ON p.ID_power_source = co.id
                HAVING date > UNIX_TIMESTAMP(NOW()) - 300
            ) AS combined
            WHERE combined.co_id = ?
            ORDER BY combined.date ASC
        `, [objectId]);

        const [regionRows] = await connection.query(`
            SELECT r.name 
            FROM region r
            JOIN connected_object co ON r.ID = co.id_region
            WHERE co.ID = ?
        `, [objectId]);

        const [typeRows] = await connection.query(`
            SELECT co.name AS connected_object, pt.type_name AS type2
            FROM power_source p
            JOIN connected_object co ON p.ID_object = co.id
            JOIN production_type pt ON p.type = pt.id
            WHERE co.type = 'production' AND co.ID = ?
        `, [objectId]);

        const [objRows] = await connection.query(
            'SELECT * FROM connected_object WHERE ID = ?', [objectId]
        );

        if (!objRows.length) return res.redirect('/');

        res.render('object', {
            data: data || [],
            region: regionRows.length ? regionRows : [{ name: 'Not found' }],
            obj: objRows[0],
            loginBtn: "Se connecter",
            path_loginBtn: "/login",
            welcome_msg: "",
            account_menu: true,
            userConnected: true,
            error_msg: "",
            niveau: niv,
            type: typeRows
        });

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Erreur interne du serveur");
    } finally {
        if (connection) await connection.end();
    }
});

router.post('/submit_form', async (req, res) => {
    try {
        await addPoints(req.session.user_id, 100); 
    } catch (err) {
        console.error("Erreur lors de l'ajout de points :", err);
        res.status(500).send("Erreur lors de l'ajout des points");
    }
});

module.exports = router;
