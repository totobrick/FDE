const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  console.log("\nPage : /");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
  return res.redirect(301, "/index");
});

module.exports = router;
