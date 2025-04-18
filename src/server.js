const mysql = require('mysql2');
const express = require('express');         // |
const app = express();                      // | pour host le site
const session = require('express-session');     // use for user session
const fs = require('fs');           // Lire des fichiers
const path = require('path');
const { log } = require('console');
const port=3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

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

// Créer une connexion à MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database'
});

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.ejs');
    console.log("Envoi du fichier " + filePath + " .");
    console.log("__dirname : " + __dirname);
    //res.sendFile(filePath);
    res.render(filePath, { loginBtn: "Se connecter",
                            path_loginBtn: "/login",
                            welcome_msg: ""});
});

app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'login.ejs');
    console.log("Envoi du fichier " + filePath + " .");
    console.log("__dirname : " + __dirname);
    //res.sendFile(filePath);
    res.render(filePath, { loginBtn: "Se connecter",
                            path_loginBtn: "/login"});
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
            req.session.connection_time = Date.now();
            req.session.cache_buster = Date.now();  // used to refresh profile picture img (if it changes) without refresh the window
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
            res.redirect(301, "/homepage");        // 301 : http status for permanent redirection
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

app.get("/homepage", (req, res) => {
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
    console.log("ID : " + req.session.user_id);
    res.render(filePath, { loginBtn: "Se déconnecter",
                            path_loginBtn: "/logout",
                            welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + ".",
                            account_menu : "yes"});
});

app.get('/personal-account', (req, res) => {
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;
    const filePath = path.join(__dirname, 'personal-account.ejs');
    console.log("ID : " + req.session.user_id);

    const query = "SELECT * FROM user WHERE ID=?";
    connection.query(query, [req.session.user_id], (err, response) => {
        if (err){
            console.error("Une erreur est survenue", err);
            return;
        }
        if (response.length == 1){
            const user_id = response[0].ID;
            const login = response[0].login;
            const password = response[0].password;
            const f_name = response[0].first_name;
            const l_name = response[0].last_name;
            const date_birth = response[0].date_of_birth;
            const mail = response[0].mail;
            const region = response[0].id_region;
            const profile_picture = response[0].profile_picture;
            const gender = response[0].gender;
            const job = response[0].job;
            const admin = response[0].admin;
            const score = response[0].score;
            
            /*
            const user_id = "user";
            const login = "login";
            const password = "pwd";
            const f_name = "f_name";
            const l_name = "l_name";
            const date_birth = "date_birth";
            const mail = "mail";
            const region = "region";
            const profile_picture = "Logos/profile_picture.svg";
            const gender = "gender";
            const job = "job";
            //const admin = response[0].admin;
            const score = 1557;*/

            /*
            console.log("gender : " + response[0].gender);
            console.log("__dirname : " + __dirname);
            console.log("profile_picture : " + profile_picture);
            */

            //const profile_picture = "Accounts/ID_" + req.session.user_id + "/profile_picture/profile_picture_ID_" + req.session.user_id + ".jpg";
            var path_profile_picture = path.join(profile_picture);
            if (fs.existsSync(path_profile_picture)) {
                console.log("Le fichier " + path_profile_picture + " existe.");
            }
            else{
                console.log("Le fichier " + path_profile_picture + " n'existe pas.");
                path_profile_picture = path.join(__dirname, "Logos/profile_picture.svg");      //TO COMPLETE the path
            }
            console.log("path_profile_picture : " + path_profile_picture);
            path_profile_picture = path_profile_picture + "?t=" + req.session.cache_buster;
            console.log("path_profile_picture : " + path_profile_picture);
            res.render(filePath, { loginBtn: "Se déconnecter",
                                    path_loginBtn: "/logout",
                                    welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + ".",
                                    account_menu : "yes",
                                    error_msg,

                                    score,
                                    login,
                                    password,
                                    f_name,
                                    l_name,
                                    mail,
                                    path_profile_picture,
                                    gender,
                                    job
                                });

        }
        else if (response.length == 0){
            console.error("ERREUR : aucun utilisateur trouvé dans la table user.");
            console.error("reponse : " + response);
            return;
        }
        else {
            console.error("ERREUR : plusieurs utilisateurs avec le meme ID ont ete trouves dans la table user.");
            console.error("reponse : " + response);
            return;
        }
    });

    
});


// Function used for page : /register_modification_account
function queryPromise(sql_query, values){
    return new Promise((resolve, reject) => {
        connection.query(sql_query, values, (err, results) => {
            if (err){
                console.error("Une erreur est survenue", err);
                return reject(err);
            };
            resolve(results);
        });
    });
}


app.post('/register_modification_account', async (req, res) => {
    try{
        const user_ID = req.session.user_id;
        console.log("ID : " + user_ID);
        console.log('POST parameter received are: ',req.body);

        const new_gender = req.body.Gender;
        const new_login = req.body.Login;
        const new_pwd = req.body.Password;
        const new_fname = req.body.Firstname;
        const new_lname = req.body.Name;
        const new_mail = req.body.Email ;
        const new_PP = req.body.Profile_picture;
        const new_job = req.body.Job;

        // Show infos in console
        console.log("***** NEW INFOS *****");
        console.log("new_gender = " + new_gender);
        console.log("new_login = " + new_login);
        console.log("new_pwd = " + new_pwd);
        console.log("new_fname = " + new_fname);
        console.log("new_lname = " + new_lname);
        console.log("new_mail = " + new_mail);
        console.log("new_PP = " + new_PP);
        console.log("new_job = " + new_job);

        
        const query = "SELECT * FROM user WHERE ID=? ";
        const response = await queryPromise(query, [user_ID]);
            // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
            //          -> fonctionne avec async

        // ERROR case
        if (response.length > 1){
            var err_msg = "ERREUR : plusieurs utilisateurs avec le meme ID ont ete trouves dans la table user.";
            console.error(err_msg);
            console.error("reponse : " + response);
            req.session.error_msg = err_msg;
            return;
        }
        // ERROR case
        else if (response.length == 0) {
            var err_msg = "ERREUR : aucun utilisateur trouvé dans la table user.";
            console.error(err_msg);
            console.error("reponse : " + response);
            req.session.error_msg = err_msg;
            return;
        }
        
        // Check if mail has changed
        console.log("response : ", response);
        console.log("response[0] : ", response[0]);
        console.log("response.mail : ", response[0].mail);
        if(new_mail != response[0].mail){
            console.log("L'utilisateur veut changer d'adresse mail !");
            return;
        }
        

        console.log("Pas de changement de mail.");

        // Login changes
        if (new_login != response[0].login){
            // Check if new login does not exist in database
            const query_0 = "SELECT login FROM user WHERE BINARY login = ?";
                // BINARY : permet de tenir compte de la casse des caracteres
            const response_0 = await queryPromise(query_0, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
            
            // Login incorrect : it exists in database
            if (response_0.length > 0){
                req.session.error_msg = "Le login " + new_login + " est déjà pris par un autre utilisateur !"
                console.log(req.session.error_msg);
                return res.redirect(301, '/personal-account');  // 301 : http status for permanent redirection
            }

            // Login is valid
            console.log("Changement de login.");
            const query_1= `UPDATE user
                            SET login = ?
                            WHERE ID = ?`;
            const response_1 = await queryPromise(query_1, [new_login, req.session.user_id]);
                // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
                //          -> fonctionne avec async
            console.log("Login mis a jour");
            console.log("response_1 : ", response_1);
        }

        score = response[0].score;
        new_score = score + 100;
        console.log("Score actuel : " + score);
        console.log("Score nouveau : " + new_score);

        const query_2= `UPDATE user
                        SET password = ?, first_name = ?, last_name = ?, gender = ?, job = ?, score = ?
                        WHERE ID = ?`;
        const response_2 = await queryPromise(query_2, [new_pwd, new_fname, new_lname, new_gender, new_job, new_score, req.session.user_id]);
            // await :  -> attend la fin de l'ececution de la fct pour passer a la suite
            //          -> fonctionne avec async
        console.log("response_2 : ", response_2);
        console.log("Infos mises à jour avec succès !");
        res.redirect(301, '/personal-account');     // 301 : http status for permanent redirection
        
        // process.nextTick : DOES NOT WORK
        //  -> delete req.session.error_msg after last command
        //  -> here delete session var after the redirection to /personal-account
        /*
        process.nextTick(() => {
            delete req.session.error_msg;
        });*/
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
        if(err){
            console.log("Echec de destruction de session.");
            return res.status(500).send("Echec de destruction de session.");
        }
        console.log("Destruction de la session réussie.");
        res.redirect(301, '/');     // 301 : http status for permanent redirection
    });
});


