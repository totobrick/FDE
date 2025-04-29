const nodemailer = require('nodemailer');
require('dotenv').config();
    // dotenv : charge les variables d'environnement
    //          elles sont nécessaires pour l'adresse mail et mot de passe de l'expéditeur.
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/send_mail_forgot_pwd', (req, res) => {
    // Données utilisateur
    const user_id = req.session.TMP_user_id;
    const user_login = req.session.TMP_login;
    const user_pwd = req.session.TMP_pwd;
    const user_mail = req.session.TMP_mail;

    // Suppresion des variables temporaires de session
    delete req.session.TMP_user_id;
    delete req.session.TMP_login;
    delete req.session.TMP_pwd;
    delete req.session.TMP_mail;

    // Mail de l'expéditeur
    var transporter = nodemailer.createTransport({
        service: process.env.MAIL_service,
        auth: {
            user: process.env.MAIL_sender,
            pass: process.env.MAIL_pwd
        }
    });

    // Lecture du contenu HTML
    let htmlContent = fs.readFileSync('./routes/mails/content_mail_forgot_pwd.html', 'utf-8');

    // Injection des variables utilisateurs dans la page web
    htmlContent = htmlContent
        .replace('{ID_utilisateur}', user_id)
        .replace('{Login_utilisateur}', user_login)
        .replace('{MDP_utilisateur}', user_pwd);

    // Version texte brut (fallback si HTML non supporté)
    const textContent = `
        Mot de passe
        Le mot de passe ci-dessous est un mot de passe généré, veuillez le changer lors de votre prochaine connexion.
        ID : ${user_id}
        Login : ${user_login}
        Mot de passe : ${user_pwd}
    `;

    // Envoi du mail
    //path: "./public/Logos/logo_FDE.svg",
    const mailOptions = {
        from: process.env.MAIL_sender,
        to: user_mail,
        subject: 'FDE : Mot de passe',
        text: textContent,
        html: htmlContent,
        // Embedded image must be a png image (svg image is not shown)
        attachments: [{
            filename: "logo_FDE.png",
            path: "./public/Logos/FDE_PNG/logo_FDE.png",
            cid: "logo_png"     // le nom cid est le meme dans le fichier html (cad : "cid:logo_png")
        }]
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Erreur lors de l'envoi :", err);
        }
        else {
            req.session.error_msg= "Email envoyé avec succès ! Veuillez vérifier votre boîte mail. Si vous ne voyez pas de mail dans votre boîte de réception, pensez à vérifier vos spams ou attendez quelques minutes la réception de l'email.";
        }
        return res.redirect(301, "/");
    });
});

module.exports = router;



