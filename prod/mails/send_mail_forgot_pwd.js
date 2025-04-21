const nodemailer = require('nodemailer');
const fs = require('fs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thomas.cylove@gmail.com',
        pass: 'clkaicauxyofkysj'
    }
});

// Lecture du contenu HTML
let htmlContent = fs.readFileSync('./content_mail_forgot_pwd.html', 'utf-8');

// Variables dynamiques à injecter
const userName = "Francisco de la papaya"

htmlContent = htmlContent
    .replace('{ID_utilisateur}', "513")
    .replace('{Pseudo_utilisateur}', userName)
    .replace('{MDP_utilisateur}', "My_Password");


// HTML personnalisé
/*
const htmlContent = `
    <h1>Bonjour ${userName} !</h1>
    <p>Voici une image personnalisée :</p>
    <img src="${imageUrl}" alt="Image personnalisée" />
    <p style='color: red; font-weight: bold;'>Fin de mail !</p>
`;*/

// Version texte brut (fallback si HTML non supporté)
const textContent = `
Bonjour ${userName},
Voici une image personnalisée (non affichée ici en texte).
`;

// Envoi du mail
//path: "./../public/Logos/logo_FDE.svg",
const mailOptions = {
    from: 'thomas.cylove@gmail.com',
    to: 'totovadordlp@gmail.com, thomas.rykaczewski@orange.fr',
    subject: 'FDE : TEST mail',
    text: textContent,
    html: htmlContent,
    // Embedded image must be a png image (svg image is not shown)
    attachments: [{
        filename: "logo_FDE.png",
        path: "./../public/Logos/FDE_PNG/logo_FDE.png",
        cid: "logo_png"
    }]
};

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        return console.error("Erreur lors de l'envoi :", err);
    }
    console.log("Email envoyé avec succès :", info.response);
});