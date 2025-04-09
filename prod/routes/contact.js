const express = require('express');
const router = express.Router();

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Nous contacter' });
});

module.exports = router;
