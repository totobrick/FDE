const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


router.get('/personalAccount', (req, res) => {

  const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'fde_database'
  });

  const error_msg = req.session.error_msg;
  delete req.session.error_msg;

  

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

          console.log(profile_picture)

          //var path_profile_picture = path.join(profile_picture);
          /*if (fs.existsSync(path_profile_picture)) {
              console.log("Le fichier " + path_profile_picture + " existe.");
          }
          else{
              console.log("Le fichier " + path_profile_picture + " n'existe pas.");
              path_profile_picture = path.join(__dirname, "Logos/profile_picture.svg");      //TO COMPLETE the path
          }*/
          /*console.log("path_profile_picture : " + path_profile_picture);
          path_profile_picture = path_profile_picture + "?t=" + req.session.cache_buster;*/
          //console.log("path_profile_picture : " + path_profile_picture);
          res.render("personalAccount", { loginBtn: "Se déconnecter",
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
                                  path_profile_picture: profile_picture,
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
