const axios = require('axios');
const express = require('express');
const mysql = require('mysql2/promise');

var dataHistory = {};
var data = {};

const getAndPushData = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });

    const [apis] = await connection.execute('SELECT id, name, link as url, apiKey FROM connected_object');

    
    apis.forEach(api => {
        data[api.id] = [];

        if (!dataHistory[api.id]) {
            dataHistory[api.id] = [];
        }
    });


    for (const api of apis) {
        try {
            const response = await axios.get(`${api.url}/getProdData`, {
                //params: { lastDataTime: api.lastDataTime },
                headers: { Authorization: api.apikey }
            });

            data[api.id].push(response.data);
            dataHistory[api.id].push(response.data);

        } catch (error) {
            console.error(`Error fetching from ${api.url}`);
            console.error("Status:", error.response?.status || "Unknown error");
            console.error("Details:", error.response?.data || error.message);
        }
    }


    const sql = 'INSERT INTO production SET ?';

    for (const api of apis) {
        const entries = data[api.id];
        if (!entries || entries.length === 0) continue;

        for (const entry of entries) {
            const prod = {
                ID_power_source: api.id,
                date_prod: entry.date,
                targeted_prod: entry.targeted_exploitation ?? null,
                actual_prod: entry.actual_exploitation ?? null,
                production: entry.production ?? null,
                opt: entry.opt ?? null
            };

            try {
                await connection.query(sql, prod);
            } catch (err) {
                console.error(`Insert error for API ID ${api.id}:`, err.message);
            }
        }
    }

    data = {};
    apis.forEach(api => {
        data[api.id] = [];
    });

    await connection.end();
};





setInterval(getAndPushData, 5000);

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json(dataHistory);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});