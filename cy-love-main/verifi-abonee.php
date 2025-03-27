<?php
function verifiAbonnee() {
    // Vérifier si l'utilisateur est connecté
    if (!isset($_SESSION['ID'])) {
        $_SESSION['error_msg'] = "Vous devez être connecté pour accéder à cette page.";
        header("Location: login.php");
        exit;
    }

    $ID = $_SESSION['ID'];
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "cy_love_database";

    try {
        $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Requête pour vérifier si l'utilisateur est abonné (ou admin, un admin a tous les droits)
        $sql = "SELECT Abonnement, Admin FROM user_info WHERE ID = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $ID, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result && ( ($result['Abonnement'] === 'OUI') || $result['Admin'] === 'oui')) {
            return true; // L'utilisateur est abonné ou admin
        }
        else {
            $_SESSION['error_msg'] = "Vous devez être abonné ou administrateur pour accéder à cette page.";
            header("Location: service.php"); // Rediriger vers la page d'abonnement
            exit;
        }
    } catch (PDOException $e) {
        echo "Erreur de connexion à la base de données: " . htmlspecialchars($e->getMessage());
        exit;
    }
}

// Appeler la fonction pour vérifier l'abonnement
verifiAbonnee();
?>
