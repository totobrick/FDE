const express = require('express');
const sql = require('mysql2');
const router = express.Router();
const {queryPromise} = require("./../functions/functions.js");



router.post('/admin_validateAccount', async (req, res) => {
    console.log("\nPage : /admin_validateAccount");

    console.log("req.body : ", req.body);
    const id_user_validate = req.body.id_user_validate;   //name of the input field
    console.log("id_user_validate : ", id_user_validate);

    // try/catch : used in case of failure for the database connection or bad request
    try {
        const query = "UPDATE user SET isValidated = 1 WHERE ID = ?";
        const response = await queryPromise(query, [id_user_validate]);

        req.session.error_msg = "Le compte de l'ID " + id_user_validate + " a été validé.";
        console.log(req.session.error_msg);
        return res.redirect("/admin");
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;