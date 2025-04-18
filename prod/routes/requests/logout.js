const express = require('express');
const router = express.Router();

router.get('/requests/logout', (req, res) => {
    req.session.destroy( (err) => {
        if(err){
            console.log("Echec de destruction de session.");
            return res.status(500).send("Echec de destruction de session.");
        }
        console.log("Destruction de la session réussie.");
        res.redirect(301, '/index');     // 301 : http status for permanent redirection
    });
});

module.exports = router;
