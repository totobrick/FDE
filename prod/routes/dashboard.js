const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/login?errorMessage=Veuillez vous connecter.');
    }
    res.render('dashboard', {
        title: 'Dashboard',
        username: user.username
    });
});

module.exports = router;
