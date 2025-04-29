const nodemailer = require('nodemailer');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const {superAdmin_mails} = require("./../functions/functions.js");

router.get('/send_mail_verifAdmin', async (req, res) => {
    console.log("\nPage : /send_mail_verifAdmin");
    if (! req.session.mail){
        console.error("Variables de session manquante inexistantes. Mail au superAdmin non envoyé car les champs du compte créés seraient 'undefined'.");
        return res.redirect(301, '/');
    }
    // Récupération des variables de session de l'utilisateur créé
    const user_gender = req.session.gender;
    const user_fname = req.session.fname;
    const user_lname = req.session.lname;
    const user_date_birth = req.session.date_birth;
    const user_mail = req.session.mail;
    const user_region = req.session.region;
    const user_login = req.session.login;

    // Suppresion des variables de session
    delete req.session.gender;
    delete req.session.fname;
    delete req.session.lname;
    delete req.session.date_birth;
    delete req.session.region;
    delete req.session.mail;
    delete req.session.login;

    // Liste contenant tous les mails des super Admin
    const resultat = await superAdmin_mails();
    console.log("resultat.length : ", resultat.length);
    console.log("resultat : ", resultat);
    if (resultat.length == 0){
        console.log("Aucun superAdmin trouvé dans la table user. Le compte ne pourra jamais être validé.");
        req.session.error_msg += "Aucun superAdmin dans la base de données, votre ne pourra pas être validé.";
        return res.redirect(301, '/');
    }

    var admin_mails = resultat[0].mail;
    console.log("admin_mails : ", admin_mails);
    for (var i=1; i<resultat.length; i++){
        console.log("resultat["+i+"].ID : ", resultat[i].ID);
        console.log("resultat["+i+"].mail : ", resultat[i].mail);
        admin_mails += ", ";
        admin_mails += resultat[i].mail;
        console.log("admin_mails : ", admin_mails);
    }



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
            .replace('{Region_utilisateur}', user_region)
            .replace('{Genre_utilisateur}', user_gender)
            .replace('{Mail_utilisateur}', user_mail);

        // Version texte brut (fallback si HTML non supporté)
        const textContent = `
            Cet utilisateur attend que vous validiez son compte.
            Login : ${user_login}
            Prénom : ${user_fname}
            Nom : ${user_lname}
            Date de naissance : ${user_date_birth}
            Région de rattachement : ${user_region}
            Genre : ${user_gender}
            Adresse mail : ${user_mail}
        `;

        // Envoi du mail
        //path: "./public/Logos/logo_FDE.svg",
        const mailOptions = {
            from: 'thomas.cylove@gmail.com',
            to: admin_mails,
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



