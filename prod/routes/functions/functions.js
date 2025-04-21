const sql = require('mysql2');

function isConnected(req){
  console.log("Fonction isConnected.");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
  // if user_id session var exists
  if (req.session.user_id){
    console.log("req.session.user_id = " + req.session.user_id);
    return true;
  }
  else{
    return false;
  }
};

// Function used for page : /register_modification_account
function queryPromise(sql_query, values){
    // Create connection to database
    const connection = sql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fde_database'
    });

    return new Promise((resolve, reject) => {
        connection.query(sql_query, values, (err, results) => {
            if (err){
                console.error("Une erreur est survenue", err);
                return reject(err);
            };
            resolve(results);
        });
    });
}

module.exports = {isConnected, queryPromise};