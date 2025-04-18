//dependances
const express = require('express');
const path = require('path');
const app = express();
const port = 8000;
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

const contactRouter = require('./routes/contact');
app.use('/', contactRouter);

const aboutRouter = require('./routes/about');
app.use('/', aboutRouter);

const loginRouter = require('./routes/login');
app.use('/', loginRouter);

const PostloginRouter = require('./routes/requests/login');
app.use('/', PostloginRouter);

const GetSearchRouter = require('./routes/requests/search');
app.use('/', GetSearchRouter);

const dashBoardRouter = require('./routes/dashboard');
app.use('/', dashBoardRouter);

const logoutdRouter = require('./routes/requests/logout');
app.use('/', logoutdRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});