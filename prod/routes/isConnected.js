const express = require('express');
const session = require('express-session');

function isConnected(req){
  console.log("Fonction isConnected.");
  console.log("Variables de session : ", req.session);
//console.log("req.session.id : ", req.session.id);
  // if user_id session var exists
  if (req.session.user_id){
    console.log("req.session.user_id = " + req.session.user_id);
    return true;
  }
  else{
    return false;
  }
};

module.exports = {isConnected};