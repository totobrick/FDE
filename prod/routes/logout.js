/*
const express = require('express');
const session = require('express-session');
const router = express.Router();*/
/*
router.get('/logout', (req, res) => {
    console.log("\nPage : /logout");
    console.log("Variables de session : ", req.session);
    //console.log("req.session.id : ", req.session.id);
    console.log("Tentative de déconnexion.");
    req.session.destroy( (err) => {
        if(err){
            console.log("Echec de destruction de session.");
            return res.status(500).send("Echec de destruction de session.");
        }
        console.log("Destruction de la session réussie.");
        return res.redirect(301, '/index');     // 301 : http status for permanent redirection
    });
});*/


/*
router.get('/logout', (req, res) => {
    console.log("\nPage : /logout");
    console.log("*************** NIQUE TA MERE ********");
    
    console.log("Variables de session : ", req.session);
    //console.log("req.session.id : ", req.session.id);
    
    if (req.session) {
        console.log("Tentative de déconnexion.");
        req.session.destroy(err => {
            if (err) {
                req.session.error_msg = "Erreur destruction session !";
                console.log(req.session.error_msg);
                return res.redirect('/homepage');
            }
            res.clearCookie('connect.sid');
            console.log("ID de cookie nettoyé avec succès : res.clearCookie('connect.sid');");
            return res.redirect('/');
        });
    }
    else {
        console.log("Echec déconnexion.");
        res.send('Pas de session à détruire');
    }
});

module.exports = router;
*/