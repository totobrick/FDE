const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Erreur à la déconnexion :", err);
        }
        res.redirect('/login');
    });
});

module.exports = router;
