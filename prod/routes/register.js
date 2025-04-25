const express = require('express');
const router = express.Router();
const { isConnected, queryPromise } = require("./functions/functions.js");

router.get('/register', async (req, res) => {
  console.log("\nPage : /register");
  console.log("Variables de session : ", req.session);

  // try/catch : used in case of failure for the database connection or bad request
  try {
    if (isConnected(req)) {
      console.log("User connected, redirection to : /homepage");
      return res.redirect(301, '/homepage');
    };
    
    // Get error_msg in session var and delete session var content
    const error_msg = req.session.error_msg;
    delete req.session.error_msg;

    // Get all regions (id + name)
    const query = "SELECT ID, name FROM region";
    const regions = await queryPromise(query, []);
    console.log("regions : ", regions);

    console.log("User not connected.");
    res.render("register", {
      loginBtn: "Se connecter",
      path_loginBtn: "/login",
      error_msg,
      date_today: new Date().toISOString().split('T')[0],
      regions
    });
  }
  catch (err) {
    console.error("Erreur dans la route :", err);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
