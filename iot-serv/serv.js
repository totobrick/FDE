const axios = require('axios');
const express = require('express');

//Data that we ll have to query from the DB
const apis = [
    { "id": 0, "url": "http://127.0.0.1:8000", "apikey": "key1", "lastDataTime": null },
    { "id": 1, "url": "http://127.0.0.1:8001", "apikey": "key2", "lastDataTime": null },
    { "id": 2, "url": "http://127.0.0.1:8002", "apikey": "key3", "lastDataTime": null }
];

let data = {};

apis.forEach(api => {
    data[api.id] = [];
});

const getData = async () => {
    for (const api of apis) {
        await axios.get(`${api.url}/getStatus`,
        {
            params: {
                'lastDataTime': `${api.lastDataTime}`
            },
            headers: {
              'Authorization': `${api.apikey}`
            }
        })

        .then(response => {
            
            //data that we ll send to the DB
            data[api.id].push(response.data);
        })

        .catch(error => {
            console.error("Error", error.response.status)
            console.log(error.response.data)
        });
    }
};

setInterval(getData, 10000);

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});