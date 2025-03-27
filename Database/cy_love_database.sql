-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 02 août 2024 à 17:38
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cy_love_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `bannis`
--

DROP TABLE IF EXISTS `bannis`;
CREATE TABLE IF NOT EXISTS `bannis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `date_ban` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bannis`
--

INSERT INTO `bannis` (`id`, `email`, `date_ban`) VALUES
(1, 'juli_2.0@hotmailwiskicaca.com', '2024-06-06'),
(2, 'MAIL1', '2024-06-06'),
(3, 'MAIL2', '2024-06-06'),
(4, 'MAIL4', '2024-06-06'),
(5, 'MAIL5', '2024-06-06'),
(6, 'MAIL6', '2024-06-06'),
(7, 'david.guetta@gmail.com', '2024-06-06'),
(8, 'taylor.swift@eras-tour.com', '2024-06-06'),
(9, 'shakira@gmail.com', '2024-06-06'),
(10, 'admin@gmail.com', '2024-06-06'),
(11, 'blackpink@gmail.com', '2024-06-21'),
(14, 'MAIL1', '2024-06-21'),
(15, 'MAIL2', '2024-06-21'),
(16, 'admin@mail.com', '2024-06-21');

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE IF NOT EXISTS `messages` (
  `ID_msg` int NOT NULL AUTO_INCREMENT,
  `ID_user_sending` int NOT NULL,
  `ID_user_receiving` int NOT NULL,
  `Message` text,
  `Date` text NOT NULL,
  `Supprimé` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_msg`),
  KEY `FK_PersonOrder` (`ID_user_sending`)
) ENGINE=MyISAM AUTO_INCREMENT=173 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`ID_msg`, `ID_user_sending`, `ID_user_receiving`, `Message`, `Date`, `Supprimé`) VALUES
(8, 10, 2, 'Salut PS2,<br />\r\nc\'est Shakira !', '', NULL),
(7, 1, 3, 'Hey PS3, c\'est PS1.<br />\r\nca va?', '', NULL),
(6, 1, 2, 'C bon je crois', '', NULL),
(68, 10, 1, 'Salut PS1, c\'est Shakira!', '', NULL),
(61, 2, 10, 'Salut Shakira, c\'est PS2 !', '', 'oui'),
(62, 10, 2, 'On va compter, je commence :<br />\r\n100 !', '', 'oui'),
(57, 2, 10, 'Salut Shakira, c\'est PS2 !', '', NULL),
(58, 10, 2, 'je fais trop de tests.<br />\r\n', '', 'oui'),
(67, 10, 1, 'Salut PS1, c\'est Shakira!', '', NULL),
(66, 2, 10, 'OK , je continue : 101 !', '', NULL),
(69, 12, 14, 'Salut', '', NULL),
(70, 12, 18, 'yo', '', NULL),
(71, 14, 12, 'Hola', '', NULL),
(72, 14, 18, 'Ciao<br />\r\n', '', NULL),
(73, 14, 12, 'ca va<br />\r\n', '', NULL),
(74, 18, 17, 'Salut je t\'aime', '', NULL),
(75, 18, 17, 'Ca va ?', '', NULL),
(76, 17, 18, 'Oui et toi<br />\r\n', '', NULL),
(77, 10, 1, 'test', '', NULL),
(78, 10, 1, 'ca va?', '', NULL),
(79, 1, 10, 'Oui et toi ?', '', NULL),
(80, 10, 1, 'C\'est correct', '', NULL),
(81, 1, 10, 'Vas y explique', '', NULL),
(82, 1, 10, 'Alors ?', '', NULL),
(83, 1, 3, 'je veux bien une réponse stp', '', NULL),
(84, 10, 1, 'nan trop long à écrire', '', NULL),
(91, 10, 1, 'je te dirai plus tard', '', NULL),
(97, 10, 8, 'Salut mon David!<br />\r\nT\'as un nouveau hit dans les tuyaux ?', '', NULL),
(99, 10, 8, 'perso j\'ai peut-être une idée mais je voudrais ton avis.<br />\r\nMuchos besos !', '2024-06-07 07:42:03', NULL),
(100, 8, 10, 'OK ma Shaki, on peut se voir jeudi pour en parler.<br />\r\nTu seras bien à Ibiza ??', '2024-06-07 08:44:25', NULL),
(101, 10, 8, 'oui', '2024-06-10 16:33:46', NULL),
(102, 10, 8, 'Salut sale con', '2024-06-10 19:09:53', NULL),
(103, 8, 10, 'Va chier salope.<br />\r\nRange ton gros bool !', '2024-06-10 19:10:21', NULL),
(104, 7, 9, 'coucou ma chiasse ', '2024-06-10 19:15:20', NULL),
(105, 7, 9, 'comment tu vas la costipée?', '2024-06-10 19:16:11', NULL),
(106, 9, 7, 'Tu viens plus au concert toi !<br />\r\nPas une swifty connasse.', '2024-06-10 19:17:15', NULL),
(107, 9, 7, 'capichegnkhjhtjh', '2024-06-10 19:17:27', NULL),
(108, 7, 9, 'non pas capiche la constipée', '2024-06-10 19:17:53', NULL),
(109, 7, 9, 'on se revoit à ton prochain concert la constipée', '2024-06-10 19:20:35', NULL),
(110, 7, 9, 'https://fr.wikipedia.org/wiki/The_Eras_Tour', '2024-06-10 19:20:58', NULL),
(111, 24, 10, 'Coucou Shakira ca va?', '2024-06-10 19:52:47', NULL),
(112, 10, 24, 'ca va et toi?<br />\r\nbiz', '2024-06-10 19:53:49', NULL),
(113, 24, 10, 'le kiffe total j\'ai pris mes boost', '2024-06-10 19:54:07', NULL),
(114, 25, 10, 'Coucou Shak, ca va ?', '2024-06-10 21:26:14', NULL),
(115, 10, 25, 'Salut Oliv,<br />\r\nbien et toi ?', '2024-06-10 21:26:57', NULL),
(116, 1, 1, 'Envoi à moi-même', '2024-06-21 14:17:49', NULL),
(117, 10, 2, '102', '2024-06-21 19:59:53', NULL),
(118, 2, 10, '103', '2024-06-21 19:59:59', NULL),
(119, 10, 2, '104', '2024-06-21 20:00:05', NULL),
(120, 2, 10, '105, alors Shak?', '2024-06-21 20:00:21', 'oui'),
(121, 10, 2, '106, et toi PS2?', '2024-06-21 20:00:40', 'oui'),
(122, 1, 10, 'test msg logo', '2024-07-10 01:46:51', NULL),
(123, 1, 10, 'test pas logo 2', '2024-07-10 01:48:04', NULL),
(124, 1, 10, 'test3', '2024-07-10 01:48:55', NULL),
(125, 1, 10, 'test4', '2024-07-10 01:49:44', NULL),
(126, 1, 10, 'test4', '2024-07-10 01:50:06', NULL),
(127, 1, 10, 'test4', '2024-07-10 01:51:46', NULL),
(128, 1, 10, 'Avec logo test 1', '2024-07-10 02:01:43', NULL),
(129, 1, 10, 'logo 1 test', '2024-07-10 02:01:53', NULL),
(130, 1, 10, 'logo 1 test', '2024-07-10 02:05:28', NULL),
(131, 1, 10, 'test encore', '2024-07-10 02:06:01', NULL),
(132, 1, 10, 'test scrollbar', '2024-07-10 03:48:39', NULL),
(133, 1, 10, 'test de refresh', '2024-07-10 03:55:00', NULL),
(134, 1, 10, 'test de refresh', '2024-07-10 03:55:03', NULL),
(135, 1, 10, 'test 2 de refresh', '2024-07-10 03:57:57', NULL),
(136, 1, 10, 'tout marche bien<br />\r\nyes', '2024-07-10 13:48:03', NULL),
(137, 10, 1, 'ok super si ca fonctionne', '2024-07-10 14:45:44', NULL),
(138, 10, 1, 'tu as écrit bcp', '2024-07-10 14:45:58', NULL),
(139, 1, 10, 'test MesgaesSSS', '2024-07-11 16:50:49', NULL),
(140, 1, 10, 'test2', '2024-07-11 16:51:51', NULL),
(141, 1, 10, 'test3', '2024-07-11 16:52:51', NULL),
(142, 1, 10, 'test4', '2024-07-11 16:52:59', NULL),
(143, 10, 1, 'test biens reçus cher Admin.', '2024-07-11 16:55:05', NULL),
(144, 10, 1, 'je revois un truc.', '2024-07-11 16:56:06', NULL),
(145, 10, 1, 'retest de scrollbar en bas après envoi', '2024-07-11 16:58:22', NULL),
(146, 10, 1, 'sans settimeout', '2024-07-11 16:59:25', NULL),
(147, 10, 1, 'avec setTimeout(scrollbarToBottom, 100);', '2024-07-11 16:59:54', NULL),
(148, 10, 1, 'avec setTimeout(scrollbarToBottom, 300);', '2024-07-11 17:00:18', NULL),
(149, 1, 10, 'test du clear textarea : <br />\r\n                    document.getElementById(\'message\').value = \"\";', '2024-07-11 17:06:30', NULL),
(150, 1, 10, 'azertyuiopqsdfghjklmwxcvbnazertyuiopqsdfghjklmwxcvbnazertyuiopqsdfghjklmwxcvbn', '2024-07-11 17:07:12', NULL),
(151, 10, 1, 'OnécritdesmotstrèstrèstrèstrèstrèstrèsLONGS', '2024-07-11 17:15:02', NULL),
(152, 10, 1, '&jkbho', '2024-07-11 17:28:08', NULL),
(153, 10, 1, '&%20pkoj', '2024-07-11 17:28:58', NULL),
(154, 10, 1, 'coucou', '2024-07-11 17:29:06', NULL),
(155, 1, 10, 'Je fais mon dernier test pour voir si j\'ai pas de \"alert\" qui apparait;.', '2024-07-11 17:31:00', NULL),
(156, 1, 10, 'la barre va en bas', '2024-07-15 11:59:23', NULL),
(157, 1, 10, 'test', '2024-08-01 10:08:15', NULL),
(158, 1, 10, 'test', '2024-08-01 10:09:10', NULL),
(159, 1, 10, ' ihgp_iygvb', '2024-08-01 10:09:15', NULL),
(160, 1, 10, 'fetgrtgrt', '2024-08-01 10:09:24', NULL),
(161, 1, 10, 'fdgegerg', '2024-08-01 10:09:33', NULL),
(162, 1, 10, 'test actualisation de variable $_SESSION[\'last_activity_time\']', '2024-08-01 10:12:36', NULL),
(163, 1, 10, 'test', '2024-08-01 10:14:46', NULL),
(164, 1, 10, 'test', '2024-08-01 10:15:38', NULL),
(165, 1, 10, 'testhgiy', '2024-08-01 10:43:31', NULL),
(166, 1, 10, 'test', '2024-08-01 10:51:38', NULL),
(167, 1, 10, 'hviuimu', '2024-08-01 10:52:17', NULL),
(168, 1, 10, 'Heure de co : 1722509642', '2024-08-01 10:54:42', NULL),
(169, 1, 10, 'Heure de co : 1722509720', '2024-08-01 10:55:34', NULL),
(170, 1, 10, 'Heure de co : 1722510101', '2024-08-01 11:01:58', NULL),
(171, 1, 10, 'ca marche bien', '2024-08-01 11:02:24', NULL),
(172, 1, 10, 'test 10s', '2024-08-01 11:02:50', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Pseudo` varchar(100) DEFAULT NULL,
  `Mot_de_passe` varchar(50) DEFAULT NULL,
  `Prénom` varchar(100) DEFAULT NULL,
  `Nom` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Photo_de_profil` varchar(255) NOT NULL,
  `Abonnement` text,
  `Preference` varchar(255) DEFAULT NULL,
  `Genre` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Profession` varchar(255) DEFAULT NULL,
  `Admin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `user_info`
--

INSERT INTO `user_info` (`ID`, `Pseudo`, `Mot_de_passe`, `Prénom`, `Nom`, `Email`, `Photo_de_profil`, `Abonnement`, `Preference`, `Genre`, `Profession`, `Admin`) VALUES
(18, 'Riri', '12', 'Rihanna', 'Diamond', 'riri@gmail.com', 'Accounts/ID_18/profile_picture/profile_picture_ID_18.jpg', 'OUI', 'Raisin', 'Madame', 'Chanteuse', NULL),
(17, 'BlueEyes', '1234', 'Gojo', 'Satoru', 'gojo@gmail.com', 'Accounts/ID_17/profile_picture/profile_picture_ID_17.jpg', 'OUI', 'Peche', 'Monsieur', 'Magicien Professionel', NULL),
(11, 'Cynthia', '1234', 'Cynthia', 'Sinnoh', 'cynthia@gmail.com', 'Accounts/ID_11/profile_picture/profile_picture_ID_11.jpg', 'OUI', 'Cerise', '', 'Maitre de la ligue', NULL),
(12, 'Spidey', 'salut', 'Peter', 'Parker', 'Peter@gmail.com', 'Accounts/ID_12/profile_picture/profile_picture_ID_12.jpg', 'OUI', 'Pasteque', 'Monsieur', 'Acteur/ Super Héros', NULL),
(13, 'MJ', '1234', 'Zendaya', 'Clark', 'zendaya@gmail.com', 'Accounts/ID_13/profile_picture/profile_picture_ID_13.jpg', NULL, 'Raisin', 'Madame', 'Actrice', NULL),
(14, 'Chili', '1234', 'Carlos', 'Sainz', 'carlos@gmail.com', 'Accounts/ID_14/profile_picture/profile_picture_ID_14.jpg', 'OUI', 'Peche', 'Monsieur', 'Pilote de F1 pour Ferrari', NULL),
(15, 'Charlie', '1234', 'Charles', 'Leclerc', 'Leclerc@gmail.fr', 'Accounts/ID_15/profile_picture/profile_picture_ID_15.jpg', NULL, 'Cerise', 'Monsieur', 'Pilote', NULL),
(16, 'Barbie', '1234', 'Margot', 'Robie', 'margot@gmail.com', 'Accounts/ID_16/profile_picture/profile_picture_ID_16.jpg', NULL, 'Raisin', 'Madame', 'Actrice/Mannequin', NULL),
(3, 'PS3', 'MDP3', 'PRENOM3', 'NOM3', 'MAIL3', '', 'NON', NULL, '', NULL, NULL),
(7, 'flo_dessin', 'chiasse2.0', 'Flora', 'Ryka', 'juli_2.0@hotmailwiskicaca.com', 'Accounts/ID_7/profile_picture/profile_picture_ID_7.jpg', 'OUI', NULL, '', NULL, NULL),
(8, 'david_guetta', 'MDPdg', 'David', 'Guetta', 'david.guetta@gmail.com', 'Accounts/ID_8/profile_picture/profile_picture_ID_8.jpg', 'OUI', NULL, 'Monsieur', 'DJ français', NULL),
(9, 'TS', 'MDPts', 'Taylor', 'Swift', 'taylor.swift@eras-tour.com', 'Accounts/ID_9/profile_picture/profile_picture_ID_9.jpg', 'OUI', NULL, '', NULL, NULL),
(10, 'Shakira', 'MDPshakira', 'Shakira', 'Isabel Mebarak Ripoll', 'shakira@gmail.com', 'Accounts/ID_10/profile_picture/profile_picture_ID_10.jpg', 'OUI', NULL, 'Madame', 'Chanteuse', NULL),
(45, 'test', 'mdp', 'test', 'test', 'totovadordlp@gmail.com', '', NULL, 'Peche', 'Madame', 'Profil exemple', NULL),
(1, 'Toto_admin', '0000', 'Thomas', 'toto', 'totovadordlp@gmail.com', '', 'OUI', NULL, 'Monsieur', 'Administrateur du site CY Love', 'oui'),
(2, 'PS2', 'MDP2', 'PRENOM2', 'NOM2', 'MAIL2', '', 'OUI', NULL, '', NULL, NULL),
(24, 'Cécé', 'Célitho', 'Cécé', 'RYKA', 'celine.lary97@orange.fr', '', 'OUI', 'Cerise', 'Madame', NULL, NULL),
(25, 'Oliv', '1234', 'Oliv', 'lechouette', 'oliv@gmail.com', '', 'OUI', 'Raisin', 'Monsieur', NULL, NULL),
(36, 'Toto', 'a', 'Thomas', 'toto', 'totovadordlp@gmail.com', '', NULL, 'Cerise', 'Monsieur', 'JSP', NULL),
(41, 'abcd', 'a', 'a', 'a', 'totovadordlp@gmail.com', '', NULL, 'Raisin', 'Madame', NULL, NULL),
(42, 'New user', 'MDP', 'Prénom', 'Nom', 'totovadordlp@gmail.com', '', NULL, 'Cerise', 'Madame', NULL, NULL),
(43, 'Griezou', 'mdp', 'Antoine', 'Griezmann', 'totovadordlp@gmail.com', '', 'OUI', 'Peche', 'Monsieur', NULL, NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
