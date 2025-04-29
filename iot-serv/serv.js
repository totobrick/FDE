const axios = require('axios');
//const express = require('express');
const mysql = require('mysql2/promise');


const sql_prod = 'INSERT INTO production SET ?';
const sql_cons = 'INSERT INTO electricity_sensor SET ?';

const getAndPushData = async () => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });

    const [apis] = await connection.execute('SELECT id, type, name, link as url, apiKey FROM connected_object');

    for (const api of apis) {
        try {
            if(api.type == "production" ?? false) {
                const response = await axios.get(`${api.url}/getProdData`, {
                    headers: { Authorization: api.apikey }
                });

                entry = response.data;

                if (!entry || entry.length === 0) continue;

                const prod = {
                    ID_power_source: api.id,
                    date_prod: entry.date,
                    targeted_prod: entry.targeted_exploitation ?? null,
                    actual_prod: entry.actual_exploitation ?? null,
                    production: entry.production ?? null,
                    quantity: entry.opt ?? null
                };

                await connection.query(sql_prod, prod);

            } else if (api.type == "cons" ?? false) {
                const response = await axios.get(`${api.url}/getDemand`, {
                    headers: { Authorization: api.apikey }
                });

                entry = response.data;                

                if (!entry || entry.length === 0) continue;

                const demand = {
                    ID_object: api.id,
                    date_need: entry.date,
                    electricity_need: entry.cons,
                }

                await connection.query(sql_cons, demand);
            }

        } catch (error) {
            console.error(`Error fetching from ${api.url}`);
            console.error("Status:", error.response?.status || "Unknown error");
            console.error("Details:", error.response?.data || error.message);
        }
    }

    await connection.end();
};





setInterval(getAndPushData, 5000);