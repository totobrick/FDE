<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$database = "cy_love_database";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $action = $_POST['action'];
        $userID = $_SESSION['ID'];

        if ($action == 'subscribe') {
            $sql = "UPDATE user_info SET abonnement = 'OUI' WHERE ID = :id";
        } elseif ($action == 'unsubscribe') {
            $sql = "UPDATE user_info SET abonnement = 'NON' WHERE ID = :id";
        }

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $userID, PDO::PARAM_INT);
        if ($stmt->execute()) {
            $message = "Abonnement mis à jour avec succès.";
        } else {
            $message = "Erreur lors de la mise à jour de l'abonnement.";
        }
    }
} catch (PDOException $e) {
    $message = "Erreur de connexion à la base de données: " . $e->getMessage();
}

// Rediriger vers le service.php avec un message
header("Location: service.php?message=" . urlencode($message));
exit;
?>
