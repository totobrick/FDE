//dependances
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const sql = require('mysql2');
const session = require('express-session');

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

// Static files (CSS, JS, Images, Logos). /!\ Accessible coté client /!\
app.use(express.static(path.join(__dirname, 'public')));

// Pour comprendre les caracteres encodés dans l'URL
app.use(express.urlencoded({ extended: true }));

// configure les sessions
app.use(session({
    secret: 'mdp', // à changer
    resave: false,
    saveUninitialized: false, // ne crée pas de session ( et dc pas de cookie) tant que rien n'a été écrit dans req.session
    cookie: {
      //secure: false,
      //maxAge: 1000 * 60 * 60  // durée de la session - 1h
      maxAge: 1000 * 60 * 30    // durée de la session - 30min
    }
  }));


// Set the index page (the router defines the path in the index.js file)
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const selectConnectedObectRoutes = require('./routes/requests/selectConnectedObject');
app.use('/', selectConnectedObectRoutes);

const emptyPathRouter = require('./routes/emptyRoute');
app.use('/', emptyPathRouter);

const homepageRouter = require('./routes/homepage');
app.use('/', homepageRouter);

const loginRouter = require('./routes/login');
app.use('/', loginRouter);
const forgotPwdRouter = require('./routes/forgot_pwd');
app.use('/', forgotPwdRouter);
const checkLoginExistsRouter = require('./routes/checkLoginExists');
app.use('/', checkLoginExistsRouter);
const sendMailForgotPwdRouter = require('./routes/mails/send_mail_forgot_pwd');
app.use('/', sendMailForgotPwdRouter);

// Paths for register
const registerRouter = require('./routes/register');
app.use('/', registerRouter);
const verifRegisterRouter = require('./routes/verifRegister');
app.use('/', verifRegisterRouter);
const sendRegisterMailCodeRouter = require('./routes/mails/send_registerMailCode');
app.use('/', sendRegisterMailCodeRouter);
const verifRegisterEnterMailCodeRouter = require('./routes/verifRegisterEnterMailCode');
app.use('/', verifRegisterEnterMailCodeRouter);
const verifCodeRegisterAccountRouter = require('./routes/requests/verifCode_registerAccount');
app.use('/', verifCodeRegisterAccountRouter);
// Used for admin verification account
const sendMailVerifAdminRouter = require('./routes/mails/send_mail_verifAdmin');
app.use('/', sendMailVerifAdminRouter);

// Admin page
const adminRouter = require('./routes/admin');
app.use('/', adminRouter);
const adminValidateAccountRouter = require('./routes/requests/admin_validateAccount');
app.use('/', adminValidateAccountRouter);

// Personal account page
const personalAccountRouter = require('./routes/personalAccount');
app.use('/', personalAccountRouter);

const userSearchRouter = require('./routes/userSearch');
app.use('/', userSearchRouter);

const objectSearchRouter = require('./routes/objectSearch');
app.use('/', objectSearchRouter);

const profileRouter = require('./routes/profile');
app.use('/', profileRouter);

const objectRouter = require('./routes/object');
app.use('/', objectRouter);

const logoutRouter = require('./routes/logout');
app.use('/', logoutRouter);

const centralCreationRouter = require('./routes/centralCreation');
app.use('/', centralCreationRouter);


const GetUserSearchRouter = require('./routes/requests/uSearch');
app.use('/', GetUserSearchRouter);

const GetObjSearchRouter = require('./routes/requests/oSearch');
app.use('/', GetObjSearchRouter);

const verifLoginRouter = require('./routes/requests/verifLogin');
app.use('/', verifLoginRouter);

//Set the index page (the router defines the path in the index.js file)
//NE MARCHE PAS
const registerModificationAccount = require('./routes/requests/registerModificationAccount');
app.use('/', registerModificationAccount);
// Register profile picture
const registerNewPPAccount = require('./routes/requests/register_new_profile_picture');
app.use('/', registerNewPPAccount);

const changePassword = require('./routes/requests/changePassword');
app.use('/', changePassword);

const route404 = require('./routes/404');
app.use('/', route404);

app.use(express.urlencoded({ extended: true })); // pour parser des formulaires HTML

app.use((req, res, next) => {
  res.redirect("/404");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});