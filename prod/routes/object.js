const express = require('express');
const router = express.Router();
const sql = require('mysql2');
const mysql = require('mysql2/promise');
const {isConnected} = require("./functions/functions.js");

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
        console.log("User not connected, redirection to : /homepage");
        return res.redirect(301, '/homepage');
    };

    let connection;
    connection = await mysql.createConnection(dbConfig);
    const [data] = await connection.query(`SELECT 
        p.date_prod AS date,
        co.name AS connected_object,
        p.production AS value,
        'production' AS type
        FROM production p
        JOIN connected_object co ON p.ID_power_source = co.id
        AND co.id = ?
        ORDER BY date ASC`, [objectId]);
    
    const [region] = await connection.query(`SELECT r.name 
        FROM region r, connected_object co
        WHERE co.ID = ?
        AND r.ID = co.id_region`, [objectId]);

    if(!data){
        data = NaN;
    }
    if (connection) await connection.end();
    db.query('SELECT * FROM connected_object WHERE ID = ?', [objectId], (err, results) => {
        if (err || results.length === 0) {
            console.log("ERROR")
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
                            error_msg : ""
        });
    });
});

module.exports = router;
