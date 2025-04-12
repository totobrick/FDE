const mysql = require('mysql2');
const express = require('express'); // |
const app = express();              // | pour host le site
const fs = require('fs');           // Lire des fichiers
const port=3100;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Créer une connexion à MySQL

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Ton utilisateur MySQL
    password: '',  // Ton mot de passe MySQL
    database: 'fde_database'
});

app.get('/', (req, res) => {
    var file = "form.html";
    console.log("fichier" + file + ".");
    fs.readFile(file, 'utf8', (err, data) => {
        if (err){
            console.error("ERREUR survenue à l'envoi du fichier" + file + ".", err);
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});

app.get('/query', (req, res) => {
    const query1 = 'SELECT login, password FROM user WHERE login=? AND password=?'
    connection.query(query1, ['Toto', 'a'], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
        }
        console.log(response);
        console.log("Nb lignes : ", response.length);

        if (response.length == 1){
            console.log(response[0].login);
            res.send("True");
        }
        else{
            res.send("False");
        }
    });
});

// Use to receive POST data
app.use(express.urlencoded({ extended: true }));

app.post("/verif_login", (req, res) => {
    console.log("Formulaire login recu.");
    const login = req.body.login;
    const pwd = req.body.password;
    console.log(`login: ${login},\npwd : ${pwd}.`);

    const query_1 = "SELECT login, password FROM user WHERE login=? AND password=?";
    connection.query(query_1, [login, pwd], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
        }
        //console.log(response);
        //console.log("Nb lignes : ", response.length);

        if (response.length == 1){
            console.log(`Bonjour ${login}, vous êtes connecté.`);
            res.redirect(301, "/connected");
        }
        else{
            res.send("Non connecté.");
        }
    });
});

app.get("/connected", (req, res) => {
    var file = "account_data.html";
    fs.readFile(file, 'utf8', (err, data) => {
        if (err){
            console.error("ERREUR survenue à l'envoi du fichier" + file + ".", err);
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
});
