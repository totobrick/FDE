<div class="account_icon_bar" id="account_icon_bar">
    <a id="first_menu" href="personal-account.php">Mes données</a>
    <a id="middle_menu" href="admin.php">Espace Administrateur</a>
    <a id="middle_menu" href="chat_history_contact.php">Messagerie</a>
    <a id="middle_menu" href="service.php">Abonnement</a>
    <a id="last_menu" href="logout.php">Déconnexion</a>
    <?php
        /* DEBUG affichage : $_SESSION['last_activity_time']
            -> variable qui déconnecte après un certain temps d'inactivité*/
        //echo "<p style='background-color: white;'> Heure de co : <b>" . $_SESSION['last_activity_time'] . "</b></p>";
    ?>
</div>