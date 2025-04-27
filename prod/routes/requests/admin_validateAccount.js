const express = require('express');
const sql = require('mysql2');
const router = express.Router();
const {isConnected, isSuperAdmin, queryPromise} = require("./../functions/functions.js");
const {send_mail_accountValidated} = require("./../mails/send_mail_accountValidated.js")



router.post('/admin_validateAccount', async (req, res) => {
    console.log("\nPage : /admin_validateAccount");

    // Check user is connected
    if(! isConnected(req)){
        console.log("User not connected, redirection to : /index");
        return res.redirect('/index');
    };

    // check user is SuperAdmin
    if(! isSuperAdmin(req)){
        req.session.error_msg = "Vous n'êtes pas superAdmin, seuls les superAdmin ont accès à cette page.";
        console.log(req.session.error_msg);
        return res.redirect(301, '/homepage');
    }

    console.log("req.body : ", req.body);
    const id_user_validate = req.body.id_user_validate;   //name of the input field
    console.log("id_user_validate : ", id_user_validate);

    // try/catch : used in case of failure for the database connection or bad request
    try {
        // SQL request : validation
        const query = "UPDATE user SET isValidated = 1 WHERE ID = ?";
        await queryPromise(query, [id_user_validate]);

        req.session.error_msg = "Le compte de l'ID " + id_user_validate + " a été validé.";
        console.log(req.session.error_msg);

        // Email : preventing the user that its account is validated
        await send_mail_accountValidated(req, id_user_validate);     // await : essentiel pour attendre l'envoi du mail avant la redirection vers /admin.
        return res.redirect("/admin");
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        res.status(500).send("Erreur serveur");
    }
});

module.exports = router;