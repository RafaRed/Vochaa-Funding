const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase-admin/app");
const responseTime = require('response-time')
const {getGithubData,isCreatedBeforeDate,getUsername} = require("./github.js")
const rateLimit = require("express-rate-limit");

initializeApp();


const app = express();
app.use(cors());
app.use(responseTime())
app.use(
  rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 12 hour duration in milliseconds
    max: 500,
    message: "You exceeded requests hour limit!",
    headers: true,
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

app.post("/auth", (req, res) => {
var idToken = req.body.idToken;
	getGithubData(idToken)
  .then((data) => console.log("is:"+isCreatedBeforeDate(data,1647474072)));
	res.json({ uid: "githubData" });
});

app.post("/getname", (req, res) => {
  var idToken = req.body.idToken;
  getGithubData(idToken)
  .then((data) => getUsername(data))
  .then(result => res.json({ "username": result }))
})

exports.app = functions.https.onRequest(app);
