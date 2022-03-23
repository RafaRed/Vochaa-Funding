const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase-admin/app");
const responseTime = require('response-time')
const {getGithubData,isCreatedBeforeDate,getUsername} = require("./github.js")
const rateLimit = require("express-rate-limit");
var admin = require("firebase-admin");

var serviceAccount = require("./config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vochafunding-default-rtdb.firebaseio.com"
});

//initializeApp();
var db = admin.database();

const app = express();
app.use(cors());
app.use(responseTime())
app.use(
  rateLimit({
    windowMs: 1 * 60 * 60 * 1000, // 12 hour duration in milliseconds
    max: 200,
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


app.post("/createcontest", (req, res) => {
  var idToken = req.body.idToken;
  getGithubData(idToken)
  .then((data) => getUsername(data))
  .then((username)=> isWhitelisted(username))
  .then((whitelisted) => {
    if(whitelisted[1] == true){
      registerContest(req.body,whitelisted[0])
      res.json({"result":"Created."})
    }
    else{
      console.log("User not whitelisted, invalid request.")
      res.json({"result":"Unable to create contest."})
    }
  })
  

})

function isWhitelisted(username){
  return new Promise((resolve,reject)=>{
    
    var ref = db.ref("/whitelist");
    console.log("Validating "+username)
    ref.once("value", function(snapshot) {
      var data = snapshot.val();
      if(data[username] === true){
        resolve([username,true])
      }
      else{
        resolve([username,false])
      }
    });
  });
  
}

function registerContest(data,username){
  var ref = db.ref("/contest");
  const contestRef = ref.push();
  contestRef.set({
    "name":data.name,
    "description":data.description,
    "logourl":data.logourl,
    "credits":data.credits,
    "funding":data.funding,
    "startDate":data.startDate,
    "endDate":data.endDate,
    "timestamp":data.timestamp,
    "sender":username,
  });

  console.log(contestRef.key)
  for(var i = 0; i < data.repositories.length; i++){
    var ref = db.ref("/repository/"+contestRef.key);
    const repoRef = ref.push();
    repoRef.set({
      name: data.repositories[i].name,
      description: data.repositories[i].description,
      url: data.repositories[i].url
    });
  }



}

app.post("/gettasks", (req, res) => {
  var contestid = req.body.contestid;
  var ref = db.ref("/repository/"+contestid);
  ref.once("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data)
    res.json(data)
  });

})




exports.app = functions.https.onRequest(app);