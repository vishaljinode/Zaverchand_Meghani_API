var firebaseAdmin = require("firebase-admin");

var serviceAccount = require("./firebase-config.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

module.exports ={ firebaseAdmin }