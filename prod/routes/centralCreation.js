const express = require('express');
const {isConnected} = require("./functions/functions.js");
const router = express.Router();

router.get('/centralCreation', (req, res) => {
    console.log("\nPage : /centralCreation");
      /*if(! isConnected(req)){
          console.log("User not connected, redirection to : /index");
          return res.redirect('/index');
      };*/
      //console.log("User connected.");
      res.render("centralCreation");
      //res.send("Bonjour");
});

module.exports = router;
