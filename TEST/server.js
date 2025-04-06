const mysql = require('mysql2');

// Créer une connexion à MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Ton utilisateur MySQL
  password: ''  // Ton mot de passe MySQL
});

// Requête SQL avec plusieurs instructions
const query = `
  DROP DATABASE IF EXISTS fde_database;
  CREATE DATABASE fde_database;
  USE fde_database;
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT
  );
  INSERT INTO users (name, email, age) VALUES
  ('Alice', 'alice@example.com', 30),
  ('Bob', 'bob@example.com', 25),
  ('Charlie', 'charlie@example.com', 35);
`;

// Exécuter la requête multiple
connection.query(query, (err, result) => {
  if (err) {
    console.error('Erreur lors de l\'exécution des requêtes SQL:', err);
  } else {
    console.log('Requêtes exécutées avec succès');
  }

  // Fermer la connexion
  connection.end();
});

/*
const mysql = require('mysql2');

// Créer une connexion à MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Ton utilisateur MySQL
  password: ''  // Ton mot de passe MySQL
});

// Requête SQL avec plusieurs instructions
const query = `
  DROP DATABASE IF EXISTS fde_database;
  CREATE DATABASE fde_database;
  USE fde_database;
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT
  );
  INSERT INTO users (name, email, age) VALUES
  ('Alice', 'alice@example.com', 30),
  ('Bob', 'bob@example.com', 25),
  ('Charlie', 'charlie@example.com', 35);
`;

// Exécuter la requête multiple
connection.query(query, (err, result) => {
  if (err) {
    console.error('Erreur lors de l\'exécution des requêtes SQL:', err);
  } else {
    console.log('Requêtes exécutées avec succès');
  }

  // Fermer la connexion
  connection.end();
});*/




/*const http = require('http')    // include the HTTP module
const mysql = require('mysql2')    // many requests can be done
const fs = require('fs')         // file system module
const port = 5000
//var mysql = require('mysql')    // requests are done 1 by 1 (sequential execution of requests)

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : ""
});



connection.connect(function(error){
    if(error){
        console.error("Erreur de connexion à MySQL." + error);
        //throw error;
    }
    else{
        console.log("Connected to MySQL database!");
    }
});

var query = `DROP DATABASE IF EXISTS fde_database;
        CREATE DATABASE IF NOT EXISTS fde_database;`;
        connection.query(query, function(err, res){
            console.log(query);
            if(err){
                console.error("Error : when creating the database.", err.message);
            }
            else{
                console.log("Database created !");
            }
        });
*/
/*
fs.readFile("fde_database.sql", 'utf8', function(err, data){
    if(err){
        console.error("Error : database file not found.");
    }
    else{
        //console.log(data);
        //return;
        

    }
});
*/