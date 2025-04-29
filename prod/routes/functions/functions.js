const sql = require('mysql2');
const bcrypt = require('bcrypt');

function isConnected(req){
  // if user_id session var exists
  if (req.session.user_id){
    return true;
  }
  else{
    return false;
  }
};

function isSuperAdmin(req){
  // if isSuperAdmin session var exists
  if (req.session.isSuperAdmin && req.session.isSuperAdmin=="1"){
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

// Hashing function
async function hashPassword(password) {
  const saltRounds = 10; 
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    return ""
  }
}


function getUserLevel(points) {
  if (points >= 4000) return 3;
  if (points >= 1000) return 2;
  return 1;
}

async function checkUserLevel(userId) {
  const sql_query = 'SELECT score FROM user WHERE id = ?';
  const values = [userId];

  try {
    const rows = await queryPromise(sql_query, values);

    if (rows.length === 0) {
      console.error('Utilisateur non trouvé.');
      return null;
    }

    const points = rows[0].score;
    const level = getUserLevel(points);

    console.log(`L'utilisateur ${userId} a ${points} points et est au niveau ${level}.`);
    return level;

  } catch (err) {
    console.error('Erreur lors de la récupération des données :', err);
    return null;
  }
}



module.exports = {isConnected, isSuperAdmin, queryPromise, addPoints, hashPassword,getUserLevel, checkUserLevel };