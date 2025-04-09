const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  const {errorMessage} = req.query; //recupere arg errorMessage

    if (req.session.user) {
        return res.redirect('/dashboard');
    }

  res.render('login', { title: 'Login', errorMessage });
});

module.exports = router;