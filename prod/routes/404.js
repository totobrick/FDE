const express = require('express');
const router = express.Router();

router.get('/404', (req, res) => {
    console.log("User connected.");

    res.render("404", {});
});

module.exports = router;
