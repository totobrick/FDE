const express = require('express');
const sql = require('mysql2');
const router = express.Router();




router.post('/login', (req, res) => {

    //A centraliser qq part
    const connection = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database',
    });


    const { username, password } = req.body; // Retrieve username and password from the form

    // Check if username and password are provided
    if (!username || !password) {
        return res.redirect('/login?errorMessage=Please provide both username and password.');
    }

    // Query the database to find the user
    //TODO: faire des verifs sur la requete
    //TODO: hash du mdp
    const query = 'SELECT * FROM user WHERE login = ? AND password = ?';
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.redirect('/login?errorMessage=An error occurred. Please try again later.');
        }

        // If a user is found
        if (results.length > 0) {
            // Success: Redirect to dashboard or home page
            req.session.user = {
                username: results[0].login,
                firstname: results[0].first_name,
                lastname: results[0].last_name
            };

        
            return res.redirect('/dashboard');  
        } else {
            return res.redirect('/login?errorMessage=Invalid username or password.');
        }
    });
});

module.exports = router;