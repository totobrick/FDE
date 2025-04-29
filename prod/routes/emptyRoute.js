const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  return res.redirect(301, "/index");
});

module.exports = router;
