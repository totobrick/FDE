const express = require('express');
const router = express.Router();
const sql = require('mysql2');
const mysql = require('mysql2/promise');
const {isConnected, checkUserLevel} = require("./functions/functions.js");

const db = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fde_database',
});

const dbConfig = {
    host: 'localhost',
    user: 'root',     
    password: '',
    database: 'fde_database'     
  };

router.get('/object', async (req, res) => {
    const objectId = req.query.id;
    if (!objectId) {
        return res.redirect('/');
    }
    if(!isConnected(req)){
        return res.redirect(301, '/index');
    };
    const userId = req.session.user_id;
    const niv = await checkUserLevel(userId)

    let connection;
    connection = await mysql.createConnection(dbConfig);
    let [data] = await connection.query(`
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
                co.id as co_id
            FROM electricity_sensor e
            JOIN connected_object co ON e.ID_object = co.id
            HAVING date > UNIX_TIMESTAMP(NOW()) - 300

            UNION ALL

            SELECT 
                p.date_prod AS date,
                co.name AS connected_object,
                p.production AS value,
                'production' AS type,
                co.id as co_id
            FROM production p
            JOIN connected_object co ON p.ID_power_source = co.id
            HAVING date > UNIX_TIMESTAMP(NOW()) - 300
            ) AS combined
            WHERE combined.co_id = ?
            ORDER BY combined.date ASC
            `, [objectId]);
    
    let [region] = await connection.query(`SELECT r.name 
        FROM region r, connected_object co
        WHERE co.ID = ?
        AND r.ID = co.id_region`, [objectId]);

    let [type] = await connection.query(
        `SELECT co.name AS connected_object, pt.type_name AS type2
            FROM power_source p
            JOIN connected_object co ON p.ID_object= co.id
            JOIN production_type pt ON p.type = pt.id
            WHERE co.type = 'production'
            AND co.ID = ?`, [objectId]);

    if(!data){
        data = NaN;
    }
    if(region == undefined){
        region = [{ name: 'Not found' }]
    }
    if (connection) await connection.end();
    db.query('SELECT * FROM connected_object WHERE ID = ?', [objectId], (err, results) => {
        if (err || results.length === 0) {
            return res.redirect('/');
        }
        const obj = results[0];

        res.render('object', { data,
                            region,
                            obj,
                            loginBtn: "Se connecter",
                            path_loginBtn: "/login",
                            welcome_msg: "",
                            account_menu : true,
                            userConnected: true,
                            error_msg : "",
                            niveau : niv, 
                            type
        });
    });
});

module.exports = router;
