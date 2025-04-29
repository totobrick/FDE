const express = require('express');
const session = require('express-session');
const router = express.Router();

router.get('/logout', (req, res) => {
  
  if (req.session) {
      req.session.destroy(err => {
          if (err) {
              req.session.error_msg = "Erreur destruction session !";
              console.error(req.session.error_msg);
              return res.redirect('/homepage');
          }
          res.clearCookie('connect.sid');   // supprime les cookies cote client
          console.log("ID de cookie nettoyé avec succès : res.clearCookie('connect.sid');");
          console. log("Utilisateur déconnecté.")
          return res.redirect('/');
      });
  }
  else {
      res.send('Pas de session à détruire');
  }
});

module.exports = router;
