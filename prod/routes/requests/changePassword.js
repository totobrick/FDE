const express = require('express');
const router = express.Router();
const {hashPassword, queryPromise} = require("./../functions/functions.js");
const bcrypt = require('bcrypt');
const multer = require('multer');
const upload = multer();

router.post('/request/changePassword',  upload.none(), async (req, res) => {

    try {
        const user_ID = req.session.user_id;

        if(!user_ID) {
            return res.status(200).json({redirect:"/index"});
        }

        if (! req.body ){
            return res.status(200).json({ message: "Internal Error.", done:false});
        }
        
        const newPassword = req.body.newPassword;
        const newPasswordConfirm = req.body.newPasswordConfirm;
        const actualPassword = req.body.actualPassword;

        if(newPassword!=newPasswordConfirm) {
            return res.status(200).json({ message: "Votre nouveau mot de passe et la confirmation du nouveau mot de passe sont différents.", done:false});
        }

        
        const query = "SELECT password FROM user WHERE BINARY ID=?";
        const response = await queryPromise(query, [user_ID]);

        const match = await bcrypt.compare(actualPassword, response[0].password);
        if(!match) {
            return res.status(200).json({ message: "Votre mot de passe est invalide !", done:false});
        }

        new_hashedPassword = await hashPassword(newPassword);

        const query2 = "update user set password=? WHERE ID=?";
        const response2 = await queryPromise(query2, [new_hashedPassword, user_ID]);

        return res.status(200).json({ message: "Le mot de passe a bien été modifié", done:true});
        
    }
    catch (err) {
        console.error("Erreur dans la route :", err);
        return res.status(200).json({ message: "Internal", done:false});
    }
});


module.exports = router;
