-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 31 mars 2025 à 09:13
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

--
-- Base de données : fde_database
--

DROP DATABASE IF EXISTS fde_database;
CREATE DATABASE IF NOT EXISTS fde_database;
USE fde_database;

-- --------------------------------------------------------

--
-- Structure de la table Region
--

DROP TABLE IF EXISTS Region;
CREATE TABLE IF NOT EXISTS Region (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(100) UNIQUE NOT NULL,
  PRIMARY KEY (ID)
);

INSERT INTO Region (ID, name) VALUES
  (1, 'IDF'),
  (2, 'Nord'),
  (3, 'PACA');

-- --------------------------------------------------------

--
-- Structure de la table user_info
--

DROP TABLE IF EXISTS user_info;
CREATE TABLE IF NOT EXISTS user_info (
  ID int NOT NULL AUTO_INCREMENT,
  login varchar(100) DEFAULT NULL,
  password varchar(50) DEFAULT NULL,
  first_name varchar(100) DEFAULT NULL,
  last_name varchar(100) DEFAULT NULL,
  date_of_birth DATE NOT NULL,
  mail varchar(100) DEFAULT NULL,
  id_region int NOT NULL,
  profile_picture varchar(255) NOT NULL,
  gender text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  profession varchar(255) DEFAULT NULL,
  admin varchar(255) DEFAULT NULL,
  score int NOT NULL DEFAULT '0',
  PRIMARY KEY (ID)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table user_info
--

INSERT INTO user_info (ID, login, password, first_name, last_name, date_of_birth, mail, id_region, profile_picture, gender, profession, admin, score) VALUES
  (1, 'Toto', 'a', 'Thomas', 'toto', '2000-01-29' 'totovadordlp@gmail.com', 1, '', 'Monsieur', 'JSP', NULL, 0),
  (2, 'david_guetta', 'MDPdg', 'David', 'Guetta', '1967-11-07', 'david.guetta@gmail.com', 2, 'Accounts/ID_2/profile_picture/profile_picture_ID_2.jpg', 'Monsieur', 'DJ français', NULL, 0),
  (3, 'Shakira', 'MDPshakira', 'Shakira', 'Isabel Mebarak Ripoll', '1977-02-02', 'shakira@gmail.com', 2, 'Accounts/ID_4/profile_picture/profile_picture_ID_4.jpg', 'Madame', 'Chanteuse', NULL, 0);
COMMIT;


-- --------------------------------------------------------

--
-- Structure de la table Connected_Object
--

DROP TABLE IF EXISTS Connected_Object;
CREATE TABLE IF NOT EXISTS Connected_Object (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(100) UNIQUE NOT NULL,
  id_region int NOT NULL,
  link varchar(100) NOT NULL,
  key varchar(100) NOT NULL,
  PRIMARY KEY (ID)
);

/*
INSERT INTO Connected_Object (ID, name, id_region, link, key) VALUES ();
*/

-- --------------------------------------------------------

--
-- Structure de la table Power_Source
--

DROP TABLE IF EXISTS Power_Source;
CREATE TABLE IF NOT EXISTS Power_Source (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(100) UNIQUE NOT NULL,
  id_region int NOT NULL,
  link varchar(100) NOT NULL,
  key varchar(100) NOT NULL,
  PRIMARY KEY (ID)
);

/*
INSERT INTO Connected_Object (ID, name, id_region, link, key) VALUES ();
*/