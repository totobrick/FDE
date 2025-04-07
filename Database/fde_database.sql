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
  ID int PRIMARY KEY AUTO_INCREMENT,
  name varchar(100) UNIQUE NOT NULL
);

INSERT INTO Region (ID, name) VALUES
  (1, 'IDF'),
  (2, 'Nord'),
  (3, 'PACA');

-- --------------------------------------------------------

--
-- Structure de la table user_info
--

DROP TABLE IF EXISTS User;
CREATE TABLE IF NOT EXISTS User (
  ID int PRIMARY KEY AUTO_INCREMENT,
  `login` varchar(100) UNIQUE NOT NULL,
  `password` varchar(50) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  mail varchar(100),
  id_region int,
  profile_picture varchar(255) DEFAULT "",
  gender text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  job varchar(255) DEFAULT NULL,
  `admin` varchar(255) DEFAULT "no",
  score int DEFAULT '0',
  FOREIGN KEY fk_id_region(id_region) REFERENCES Region(ID),
  CONSTRAINT unique_values UNIQUE (first_name, last_name, date_of_birth)
);

--
-- Déchargement des données de la table user_info
--

INSERT INTO User (ID, `login`, `password`, first_name, last_name, date_of_birth, mail, id_region, profile_picture, gender, job, `admin`, score) VALUES
  (1, 'Toto', 'a', 'Thomas', 'toto', '2000-01-29', 'totovadordlp@gmail.com', 1, '', 'Monsieur', 'JSP', "yes", 0),
  (2, 'david_guetta', 'MDPdg', 'David', 'Guetta', '1967-11-07', 'david.guetta@gmail.com', 2, 'Accounts/ID_2/profile_picture/profile_picture_ID_2.jpg', 'Monsieur', 'DJ français', "no", 0),
  (3, 'Shakira', 'MDPshakira', 'Shakira', 'Isabel Mebarak Ripoll', '1977-02-02', 'shakira@gmail.com', 2, 'Accounts/ID_4/profile_picture/profile_picture_ID_4.jpg', 'Madame', 'Chanteuse', "no", 0);



-- --------------------------------------------------------

--
-- Structure de la table Connected_Object
-- Valeurs de 'type' : "production" (pour les objets qui produisent de l'énergie) ou "sensor" (pour les capteurs qui mesurent le besoin régional en énergie)
--

DROP TABLE IF EXISTS Connected_Object;
CREATE TABLE IF NOT EXISTS Connected_Object (
  ID int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) UNIQUE,
  `type` varchar(100) NOT NULL,
  id_region int,
  link varchar(100) NOT NULL,
  `key` varchar(100) NOT NULL,
  FOREIGN KEY fk_id_region(id_region) REFERENCES Region(ID),
  CONSTRAINT check_type_object CHECK(`type`="production" OR `type`="sensor")
);


INSERT INTO Connected_Object (ID, `name`, `type`, id_region, link, `key`) VALUES
  (1, "Nucleaire_1.1", "production", 1, "link1.1", "key1.1"),
  (2, "Nucleaire_1.2", "production", 1, "link1.2", "key1.2"),
  (3, "Eolien_1.3", "production", 1, "link1.3", "key1.3"),
  (4, "Hydro_1.4", "production", 1, "link1.4", "key1.4"),
  (5, "Nucleaire_2.5", "production", 2, "link2.5", "key2.5"),
  (6, "Eolien_2.6", "production", 2, "link2.6", "key2.6"),
  (7, "Hydro_2.7", "production", 2, "link2.7", "key2.7"),
  (8, "Nucleaire_3.8", "production", 3, "link3.8", "key3.8"),
  (9, "Capteur_1.9", "sensor", 1, "link1.9", "key1.9"),
  (10, "Capteur_2.10", "sensor", 2, "link2.10", "key2.10");


-- --------------------------------------------------------

--
-- Structure de la table Power_Source
-- Une "Power_Source" peut être : une centrale nucléaire, un barrage hydroélectrique, un parc éolien, un parc solaire
--

DROP TABLE IF EXISTS Power_Source;
CREATE TABLE IF NOT EXISTS Power_Source (
  ID_object int PRIMARY KEY,
  `type` varchar(100) NOT NULL,
  max_prod int NOT NULL,
  min_prod int DEFAULT 0,
  FOREIGN KEY fk_id_object(ID_object) REFERENCES Connected_Object(ID),
  CONSTRAINT check_type_power_source CHECK (`type`="nuclear" OR `type`="hydroelectric" OR `type`="solar" OR `type`="wind_turbine"),
  CONSTRAINT check_max_prod CHECK (max_prod>0),
  CONSTRAINT check_min_prod CHECK (min_prod>=0)
);


INSERT INTO Power_Source (ID_object, `type`, max_prod, min_prod) VALUES
  (1, "nuclear", 15000, 3000),
  (2, "nuclear", 25000, 5000),
  (3, "wind_turbine", 4200, 0),
  (4, "solar", 2479, 0),
  (5, "nuclear", 30000, 6000),
  (6, "wind_turbine", 2000, 0),
  (7, "solar", 2612, 0),
  (8, "nuclear", 18000, 3600);


-- --------------------------------------------------------

--
-- Structure de la table Production
--

DROP TABLE IF EXISTS Production;
CREATE TABLE IF NOT EXISTS Production (
  ID_power_source int,
  date_prod int NOT NULL,
  targeted_prod float,
  actual_prod float,
  PRIMARY KEY (ID_power_source, date_prod),
  FOREIGN KEY fk_id_power_source(ID_power_source) REFERENCES Power_Source(ID),
  CONSTRAINT check_targeted_prod CHECK (targeted_prod>=0 AND targeted_prod<=1),
  CONSTRAINT check_actual_prod CHECK (actual_prod>=0 AND actual_prod<=1)
);


-- --------------------------------------------------------

--
-- Structure de la table Production
-- electricity need : refers to regional need of electricity in MW
--

DROP TABLE IF EXISTS Electricity_Sensor;
CREATE TABLE IF NOT EXISTS Electricity_Sensor (
  ID_object int PRIMARY KEY,
  date_need DATETIME NOT NULL,
  electricity_need int NOT NULL,
  FOREIGN KEY fk_id_object(ID_object) REFERENCES Connected_Object(ID)
);

INSERT INTO Electricity_Sensor (ID_object, date_need, electricity_need) VALUES
  (9, "2025-01-01 10:30:00", 50000),
  (10, "2025-01-01 10:30:00", 75000);

COMMIT;
-- COMMIT; : valide definitivement les changements faits dans la base de données
