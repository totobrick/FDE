-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 28 mars 2025 à 20:27
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fde_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `employees`
--

INSERT INTO `employees` (`ID`, `first_name`, `last_name`) VALUES
(10, 'A', 'A');

-- --------------------------------------------------------

--
-- Structure de la table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `login` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `mail` varchar(100) DEFAULT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `gender` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `admin` varchar(255) DEFAULT NULL,
  `score` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`ID`, `login`, `password`, `first_name`, `last_name`, `mail`, `profile_picture`, `gender`, `profession`, `admin`, `score`) VALUES
(2, 'david_guetta', 'MDPdg', 'David', 'Guetta', 'david.guetta@gmail.com', 'Accounts/ID_2/profile_picture/profile_picture_ID_2.jpg', 'Monsieur', 'DJ français', NULL, 0),
(3, 'TS', 'MDPts', 'Taylor', 'Swift', 'taylor.swift@eras-tour.com', 'Accounts/ID_3/profile_picture/profile_picture_ID_3.jpg', 'Madame', 'Chanteuse du Eras tour.', NULL, 0),
(4, 'Shakira', 'MDPshakira', 'Shakira', 'Isabel Mebarak Ripoll', 'shakira@gmail.com', 'Accounts/ID_4/profile_picture/profile_picture_ID_4.jpg', 'Madame', 'Chanteuse', NULL, 0),
(1, 'Toto_admin', '0000', 'Thomas', 'toto', 'totovadordlp@gmail.com', '', 'Monsieur', 'Administrateur du site.', 'oui', 0),
(5, 'Toto', 'a', 'Thomas', 'toto', 'totovadordlp@gmail.com', '', 'Monsieur', 'JSP', NULL, 0),
(47, 'A', 'A', 'A', 'A', 'totovadordlp@gmail.com', '', 'Madame', NULL, NULL, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
