const express = require('express');
const router = express.Router();

router.get('/registerModificationAccount', (req, res) => {
    /*try{
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
    /*}
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }*/

});


module.exports = router;
