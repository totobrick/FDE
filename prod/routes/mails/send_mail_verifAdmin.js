const nodemailer = require('nodemailer');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/send_mail_verifAdmin', (req, res) => {
    console.log("\nPage : /send_mail_verifAdmin");

    // Récupération des variables de session de l'utilisateur créé
    const user_gender = req.session.gender;
    const user_fname = req.session.fname;
    const user_lname = req.session.lname;
    const user_date_birth = req.session.date_birth;
    const user_mail = req.session.mail;
    const user_login = req.session.login;

    // Suppresion des variables de session
    delete req.session.gender;
    delete req.session.fname;
    delete req.session.lname;
    delete req.session.date_birth;
    delete req.session.mail;
    delete req.session.login;

    // Mail de l'expéditeur
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'thomas.cylove@gmail.com',
            pass: 'clkaicauxyofkysj'
        }
    });

    try {
        // Lecture du contenu HTML
        let htmlContent = fs.readFileSync('./routes/mails/content_mail_adminVerifAccount.html', 'utf-8');

        // Injection des variables utilisateurs dans la page web
        htmlContent = htmlContent
            .replace('{Login_utilisateur}', user_login)
            .replace('{Prenom_utilisateur}', user_fname)
            .replace('{Nom_utilisateur}', user_lname)
            .replace('{Naissance_utilisateur}', user_date_birth)
            .replace('{Genre_utilisateur}', user_gender)
            .replace('{Mail_utilisateur}', user_mail);

        // Version texte brut (fallback si HTML non supporté)
        const textContent = `
            Cet utilisateur attend que vous validiez son compte.
            Login : ${user_login}
            Prénom : ${user_fname}
            Nom : ${user_lname}
            Date de naissance : ${user_date_birth}
            Genre : ${user_gender}
            Adresse mail : ${user_mail}
        `;

        // Envoi du mail
        //path: "./public/Logos/logo_FDE.svg",
        const mailOptions = {
            from: 'thomas.cylove@gmail.com',
            to: user_mail,
            subject: "FDE : Validation d'un nouveau compte",
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
                return console.error("Erreur lors de l'envoi :", err);
            }
            console.log("Email envoyé avec succès :", info.response);
            req.session.error_msg+= "Email envoyé avec succès à l'Administrateur ! Ce dernier prendra de validation de valider votre compte (ou non ;) ).";
            return res.redirect(301, "/");
        });
    }
    catch(err){
        console.error("Erreur dans a l'envoi de l'email :", err);
        req.session.error_msg = "Erreur : une erreur est survenue lors de l'envoi de l'email. Le mail n'a pas été envoyé.";
        return res.redirect(301, '/');
    }
});

module.exports = router;



