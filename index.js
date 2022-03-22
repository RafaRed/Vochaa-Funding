const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
var admin = require("firebase-admin");
const { getAuth } = require('firebase-admin/auth');

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vochafunding-default-rtdb.firebaseio.com"
});

const app = express();
app.use(cors())

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1;  // London is UTC + 1hr;
  res.send(`
    <!doctype html>
    <head>
      <title>Time</title>
      <link rel="stylesheet" href="/style.css">
      <script src="/script.js"></script>
    </head>
    <body>
      <p>In London, the clock strikes:
        <span id="bongs">${'BONG '.repeat(hours)}</span></p>
      <button onClick="refresh(this)">Refresh</button>
    </body>
  </html>`);
});

app.get('/auth', (req, res) => {
  var idToken = req.body.idToken;

  getAuth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    res.send(uid)
  })
  .catch((error) => {
    // Handle error
  });
});

exports.app = functions.https.onRequest(app);

