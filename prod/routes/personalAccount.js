const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const {isConnected} = require("./functions/functions.js");


router.get('/personalAccount', (req, res) => {
    console.log("\nPage : /personalAccount");
    console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);

    // Check user is connected
    if(! isConnected(req)){
        console.log("User not connected, redirection to : /index");
        return res.redirect('/index');
    };
    console.log("User connected.");

    // Connection to database
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database'
    });

    // Get error_msg in session var and delete session var content
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;

    // Get all user datas and show it int the page
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
            var profile_picture = response[0].profile_picture;
            const gender = response[0].gender;
            const job = response[0].job;
            const admin = response[0].admin;
            const score = response[0].score;

            console.log(profile_picture)

            //var path_profile_picture = path.join(profile_picture);
            /*if (fs.existsSync(path_profile_picture)) {
                console.log("Le fichier " + path_profile_picture + " existe.");
            }
            else{
                console.log("Le fichier " + path_profile_picture + " n'existe pas.");
                path_profile_picture = path.join(__dirname, "Logos/profile_picture.svg");      //TO COMPLETE the path
            }*/
            console.log("profile_picture : ", profile_picture);
            if( profile_picture === ""){
                profile_picture = "Logos/profile_picture.svg";
                console.log("profile_picture : ", profile_picture);
            }
            var path_profile_picture = profile_picture + "?t=" + req.session.cache_buster;
            console.log("path_profile_picture : ", path_profile_picture);
            
            res.render("personalAccount", { loginBtn: "Se déconnecter",
                                    path_loginBtn: "/logout",
                                    welcome_msg: "Bienvenue " + req.session.user_id + " " + req.session.login + " "+ req.session.password + ".",
                                    account_menu : true,
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

module.exports = router;
