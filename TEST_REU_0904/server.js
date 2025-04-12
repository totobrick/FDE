//les dependances
const fs = require('fs'); //Lire des fichiers
const express = require('express'); // |
const app = express();              // | pour host le site
const sql = require('mysql2'); //sql
const path = require('path'); //pour arborescence
const port = 3000;


//A mettre pour envoyer des données avec post
app.use(express.urlencoded({ extended: true }));

//To use ejs
app.set('view engine', 'ejs');

//We will not use it as it give the client direct acess to the files
//app.use(express.static(path.join(__dirname, 'html')));


//test de base
app.get('/', (req, res) => {
    res.send("COUCOU");
});

//test with file : A utiliser si page static
app.get('/ert', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

//test post
app.post('/loggingIn', (req, res) => {
    const { username, password } = req.body;

    if(username === "a") {
        res.send("OK");
        return;
    } 

    res.send("KO");
  
});

username = "test";
email = "t.t@gmail.com";


//NE PAS UTLISER CETTE VERSION (cf. /users)
app.get('/account', (req, res) => {
    const filePath = path.join(__dirname, 'html', 'account.html');

    fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send('Error loading account page');
        }

        const htmlWithUserInfo = html.replaceAll('<!--USERNAME-->', username)
                                        .replaceAll('<!--USER_EMAIL-->', email);

        res.send(htmlWithUserInfo);
    });
});


//test ejs
const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];
app.get('/act', (req, res) => {
    const filePath = path.join(__dirname, 'html', 'act2.ejs');
    res.render(filePath, { items }); // Pass the 'items' array to the EJS template
});


//test ejs with database
app.get('/users', (req, res) => {
    const connection = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });

    

    const sql_request = 'SELECT * FROM user WHERE ?';

    connection.query(sql_request, 1, (err, result) => {
        if (err) {
            console.error('Insert error:', err);
        }

        users = result;
        const filePath = path.join(__dirname, 'ejs', 'users.ejs');
        res.render(filePath, { users });
    });
    
    
})


//IMPORTANT : Ce qui lance le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});