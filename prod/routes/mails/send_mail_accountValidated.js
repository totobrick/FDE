const nodemailer = require('nodemailer');
require('dotenv').config();
    // dotenv : charge les variables d'environnement
    //          elles sont nécessaires pour l'adresse mail et mot de passe de l'expéditeur.
const fs = require('fs');
const express = require('express');
const router = express.Router();
const {queryPromise} = require("./../functions/functions.js");

async function send_mail_accountValidated(req, user_id) {

    try {
        const sql = "SELECT login, mail FROM user WHERE ID = ?";
        const response = await queryPromise(sql, [user_id]);

        // Un utilisateur trouvé dans la database
        if (response.length == 1){

            // Données utilisateur
            const user_login = response[0].login;
            const user_mail = response[0].mail;

            // Mail de l'expéditeur
            const transporter = nodemailer.createTransport({
                service: process.env.MAIL_service,
                auth: {
                    user: process.env.MAIL_sender,
                    pass: process.env.MAIL_pwd
                }
            });

            try {
                // Lecture du contenu HTML
                let htmlContent = fs.readFileSync('./routes/mails/content_mail_accountValidated.html', 'utf-8');

                // Injection des variables utilisateurs dans la page web
                htmlContent = htmlContent.replace('{Login_utilisateur}', user_login);

                // Version texte brut (fallback si HTML non supporté)
                const textContent = `
                    Félicitations ${user_login} !
                    Votre compte a été validé par le superAdmin.
                    Vous pouvez désormais vous connecter à votre compte FDE.
                    
                    Toute l'équipe FDE vous remercie de votre confiance !
                `;

                // Envoi du mail
                //path: "./public/Logos/logo_FDE.svg",
                const mailOptions = {
                    from: process.env.MAIL_sender,
                    to: user_mail,
                    subject: 'FDE : Votre compte a été validé',
                    text: textContent,
                    html: htmlContent,
                    // Embedded image must be a png image (svg image is not shown)
                    attachments: [{
                        filename: "logo_FDE.png",
                        path: "./public/Logos/FDE_PNG/logo_FDE.png",
                        cid: "logo_png"     // le nom cid est le meme dans le fichier html (cad : "cid:logo_png")
                    }]
                };

                await transporter.sendMail(mailOptions);
                req.session.error_msg += "Un mail a été envoyé à l'utilisateur validé.";
            }
            catch(err){
                console.error("Erreur lors de l'envoi de l'email :", err);
                req.session.error_msg += "Erreur : une erreur est survenue lors de l'envoi de l'email. Le mail n'a pas été envoyé.";
                //return res.redirect(301, '/admin');
            }

        }
        else if (response.length >= 2){
            req.session.error_msg = "Mail non envoyé à l'utilisateur validé : : au moins 2 utilisateurs possèdent le même ID.";
            console.error(req.session.error_msg);
            return res.redirect("/login");
        }
        else{
            req.session.error_msg = "Mail non envoyé à l'utilisateur validé : aucun ID correspondant dans la base de données";
            console.error(req.session.error_msg);
            return res.redirect("/login");
        }
    }
    catch (err) {
        console.error("Erreur dans l'accès aux infos de l'utilisateur validé ou dans l'envoi de mail :", err);
        res.status(500).send("Erreur serveur");
    }
}

module.exports = {send_mail_accountValidated};



