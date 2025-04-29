const nodemailer = require('nodemailer');
const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/send_registerMailCode', (req, res) => {
    // Données utilisateur
    const user_code = req.session.code;
    const user_mail = req.session.mail;

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
        let htmlContent = fs.readFileSync('./routes/mails/content_mail_verif_register.html', 'utf-8');

        // Injection des variables utilisateurs dans la page web
        htmlContent = htmlContent
            .replace('{Code_verif}', user_code);

        // Version texte brut (fallback si HTML non supporté)
        const textContent = `
            Vérification
            Ce code doit être saisi sans espaces.
            Code : ${user_code}
        `;

        // Envoi du mail
        //path: "./public/Logos/logo_FDE.svg",
        const mailOptions = {
            from: 'thomas.cylove@gmail.com',
            to: user_mail,
            subject: 'FDE : Code de vérification',
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

            req.session.error_msg= "Email envoyé avec succès ! Veuillez vérifier votre boîte mail. Si vous ne voyez pas de mail dans votre boîte de réception, pensez à vérifier vos spams ou attendez quelques minutes la réception de l'email.";
            return res.redirect(301, "/verifRegisterEnterMailCode");
        });
    }
    catch(err){
        console.error("Erreur lors de l'envoi de l'email :", err);
        req.session.error_msg = "Erreur : une erreur est survenue lors de l'envoi de l'email. Le mail n'a pas été envoyé.";
        return res.redirect(301, '/');
    }
});

module.exports = router;



