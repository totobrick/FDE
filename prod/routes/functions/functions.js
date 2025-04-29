const sql = require('mysql2');

function isConnected(req){
  /*console.log("Fonction isConnected.");
  console.log("Variables de session : ", req.session);*/

  // if user_id session var exists
  if (req.session.user_id){
    console.log("req.session.user_id = ", req.session.user_id);
    return true;
  }
  else{
    return false;
  }
};

function isSuperAdmin(req){
  // if isSuperAdmin session var exists
  if (req.session.isSuperAdmin && req.session.isSuperAdmin=="1"){
    console.log("req.session.isSuperAdmin = ", req.session.isSuperAdmin);
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


async function addPoints(userId, pointsToAdd) {
  const sql_query = 'UPDATE user SET score = score + ? WHERE id = ?';
  const values = [pointsToAdd, userId];

  try {
    const result = await queryPromise(sql_query, values);
    console.log(`+${pointsToAdd} points ajoutés à l'utilisateur ID ${userId}`);
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'ajout des points :', error);
    throw error;
  }
}


module.exports = {isConnected, isSuperAdmin, queryPromise, addPoints};