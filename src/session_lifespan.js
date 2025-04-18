
$(document).ready(function(){
    checkSession();
    // Vérification session expirée (toutes les 1min)
    var exe_check_Session = setInterval(checkSession, 60000); // en millisecondes (ici 60000 = 60s = 1min)

    function checkSession(){
        $.ajax({
            type: 'POST',
            url: 'session_lifespan.php',
            success: function(response){
                //document.getElementById('time_session').innerHTML += response;
                if (response === "Session_expired"){
                    document.getElementsByClassName("account_icon_bar")[0].innerHTML += "<p style='background-color: white;'>" + response + "</p>";
                    window.location.href = "logout_session_expired.php";
                    alert("Votre session a expiré.\n Vous allez être redirigé(e) vers la page de connexion.");
                    exit();
                }
                else if (response === 'logout_connection-time-not-found'){
                    document.getElementsByClassName("account_icon_bar")[0].innerHTML += "<p style='background-color: white;'>" + response + "</p>";
                    window.location.href = "logout.php";
                    alert("Heure de connexion à la session non trouvée.");
                    exit();
                }
                var temps = Math.floor(Date.now() / 1000);
                //document.getElementsByClassName("account_icon_bar")[0].innerHTML += "<p style='background-color: white;'>" + temps + "</p>";
                //alert('Time refresh :' + response);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert('Une erreur est survenue.');
            }
        });
    }
});