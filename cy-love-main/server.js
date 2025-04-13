const mysql = require('mysql2');
const express = require('express');         // |
const app = express();                      // | pour host le site
const session = require('express-session');     // use for user session
const fs = require('fs');           // Lire des fichiers
const path = require('path');
const port=3100;

app.use(session({
    secret: 'ThisKeyProtectsMySession', // this marks the cookie session
    resave: false,                      // | true : register session for all requests 
                                        // | false : session is registered only if there is modification, it's to say when necessary (better performances)
    saveUninitialized: false            // do not register an empty session (before login for ex)
}));

// Use to receive POST data
app.use(express.urlencoded({ extended: true }));

//essential for import style
app.use(express.static(path.join(__dirname)));

//app.use('/Styles', express.static(__dirname + '/Styles'));
    // app.use([path], middlewareFunction) :
    //      | path : chemin sur le lequel le middleware / la fonction s'applique
    //      | middlewareFunction : notre fonction
    // ICI : on rend tous les fichiers de style accessibles.

//To use ejs
app.set('view engine', 'ejs');
    // ejs files wil be included without their extensions
    // ex : 'header.ejs' is included like this : 'header'

// Change les dossier de vues (cad les rend visible s'ils ne le sont pas)
//app.set('views', chemin)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Créer une connexion à MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database'
});

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'login.ejs');
    console.log("Envoi du fichier " + filePath + " .");
    console.log("__dirname : " + __dirname);
    //res.sendFile(filePath);
    res.render(filePath);
    /*fs.readFile(filePath, 'utf8', (err, data) => {
        if (err){
            console.error("ERREUR survenue à l'envoi du fichier" + filePath + ".", err);
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });*/
});


app.post("/verif_login", (req, res) => {
    console.log("Formulaire login recu.");
    const login = req.body.login;   //name of the input field
    const pwd = req.body.password;  //name of the input field
    console.log(`login: ${login},\npwd : ${pwd}.`);

    const query_1 = "SELECT ID FROM user WHERE login=? AND password=?";
    connection.query(query_1, [login, pwd], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
        }
        console.log(response);
        console.log("ID : " + response[0].ID);
        console.log("Nb lignes : ", response.length);

        if (response.length == 1){
            console.log(`Bonjour ${login}, vous êtes connecté.`);
            req.session.user_id = response[0].ID;
            req.session.login = login;
            req.session.password = pwd;
            /*
            res.cookie('sessionID','007', {
                expires: new Date(Date.now() + 3)
            });*/

            if (! req.session.login){
                console.log("LOGIN : Pas de variable de session.");
                return;
            }
            else{
                console.log("LOGIN : variable de session existante.");
            }
            if (! req.session.password){
                console.log("PASSWORD : Pas de variable de session.");
                return;
            }
            else{
                console.log("PASSWORD : variable de session existante.");
            }
            res.redirect(301, "/connected_homepage");        // 301 : http status for permanent redirection
        }
        else{
            res.send("Non connecté.");
        }
    });
});

/*
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
*/


app.get("/connected_homepage", (req, res) => {
    const filePath = path.join(__dirname, 'index.ejs');
    /*fs.readFile(filePath, 'utf8', (err, data) => {
        if (err){
            console.error("ERREUR survenue à l'envoi du fichier" + filePath + ".", err);
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.write("Variable de session :<br> login : " + req.session.login + "<br>\t pwd : " + req.session.password);
        res.end();
    });*/
    console.log("ID : " + req.session.user_id)
    res.render(filePath, { welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + "."})
});

app.get('/page2', (req, res) => {
    var file ="page2.html";
    fs.readFile(file, 'utf8', (err, data) => {
        if (err){
            console.error("ERREUR survenue à l'envoi du fichier" + file + ".", err);
        }
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.write("Variable de session :<br> login : " + req.session.login + "<br>\t pwd : " + req.session.password);
        res.end();
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if(err){
            console.log("Echec de destruction de session.");
            return res.status(500).send("Echec de destruction de session.");
        }
        console.log("Destruction de la session réussie.");
        res.redirect(301, '/');     // 301 : http status for permanent redirection
    });
});
