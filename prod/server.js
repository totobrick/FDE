//dependances
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const session = require('express-session');

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS, JS, Images). /!\ Accesible coté client /!\
app.use(express.static(path.join(__dirname, 'public')));

//Pour comprendre les caracteres encodés dans l'URL
app.use(express.urlencoded({ extended: true }));

//configure les sessions
app.use(session({
    secret: 'mdp', // à changer
    resave: false,
    saveUninitialized: false, //car pas en https
    cookie: {
      maxAge: 1000 * 60 * 60 // durée de la session - 1h
    }
  }));


//Set the index page (the router defines the path in the index.js file)
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

//Set the index page (the router defines the path in the index.js file)
const loginRouter = require('./routes/login');
app.use('/', loginRouter);

//Set the index page (the router defines the path in the index.js file)
const personalAccountRouter = require('./routes/personalAccount');
app.use('/', personalAccountRouter);

const logoutRouter = require('./routes/requests/logout');
app.use('/', logoutRouter);

//Set the index page (the router defines the path in the index.js file)
//NE MARCHE PAS
//const registerModificationAccount = require('./routes/requests/registerModificationAccount');
//app.use('/', registerModificationAccount);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});