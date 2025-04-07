const axios = require('axios');
const express = require('express');
const mysql = require('mysql2');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'fde_database',
});



//Data that we ll have to query from the DB
const apis = [
    { "id": 0, "url": "http://127.0.0.1:8000", "apikey": "key1", "lastDataTime": null },
    { "id": 1, "url": "http://127.0.0.1:8001", "apikey": "key2", "lastDataTime": null },
    { "id": 2, "url": "http://127.0.0.1:8002", "apikey": "key3", "lastDataTime": null },
    { "id": 3, "url": "http://127.0.0.1:8003", "apikey": "key4", "lastDataTime": null }
];

var dataG = {};
apis.forEach(api => {
    dataG[api.id] = [];
});


var data = {};

apis.forEach(api => {
    data[api.id] = [];
});

const getData = async () => {
    for (const api of apis) {
        try {
            const response = await axios.get(`${api.url}/getProdData`, {
                params: { 'lastDataTime': api.lastDataTime },
                headers: { 'Authorization': api.apikey }
            });

            data[api.id].push(response.data);
            dataG[api.id].push(response.data);
            //console.log(data[api.id]);

        } catch (error) {
            console.error(api)
            console.error("Error:", error.response?.status || "Unknown error");
            console.error(error.response?.data || error.message);
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
                targeted_prod: entry.targeted_exploitation ?? undefined,
                actual_prod: entry.actual_exploitation ?? undefined
            };

            connection.query(sql, prod, (err, result) => {
                if (err) {
                    console.error('Insert error:', err);
                }
            });
        }
    }
    data = {};
    apis.forEach(api => {
        data[api.id] = [];
    });
};

setInterval(getData, 1000);

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json(dataG);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});