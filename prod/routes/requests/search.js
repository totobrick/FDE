const express = require('express');
const sql = require('mysql2');
const router = express.Router();

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fde_database',
});

router.post('/search', (req, res) => {
    const { username } = req.body; // Retrieve username from the form

    // Check if username is provided
    if (!username) {
        return res.redirect('/dashboard?errorMessage=Please provide a username to search.');
    }

    // Query the database to find the user
    const query = 'SELECT * FROM user WHERE login LIKE ?';
    connection.query(query, ["%" + username + "%"], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.redirect('/dashboard?errorMessage=An error occurred. Please try again later.');
        }
        // If a user is found
        if (results.length > 0) {
            // Success: Debug
            console.log(results)
            // Non :(
            /*const container = document.getElementById("users")
            container.innerHTML = results.map(item => {
                return `
                    <div class="result-user">
                        <h3>${item.login}</h3>
                    </div>
                `;
            }).join('');*/
        } else {
            return res.redirect('/dashboard?errorMessage=No one was found.');
        }
    });
});

module.exports = router;