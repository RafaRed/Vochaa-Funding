const { getAuth } = require("firebase-admin/auth");
const axios = require("axios");
const { resolve } = require("path");
const {myCache} = require("./cache")

module.exports.getGithubData = function(idToken) {
	return new Promise((resolve, reject) => {
		getGithubUid(idToken)
			.then((githubUid) => fetchGithub(githubUid))
			.then((data) => resolve(data));
	}).catch((error) => {
		reject(error);
	});
}

function getGithubUid(idToken) {
	return new Promise((resolve, reject) => {
		getAuth()
			.verifyIdToken(idToken)
			.then((decodedToken) => {
				const githubUid = decodedToken.firebase.identities["github.com"][0];
				resolve(githubUid);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function fetchGithub(uid) {
	return new Promise((resolve, reject) => {
        
        key = "user_"+uid
        value = myCache.get(key);
        if ( value == undefined ){
            axios
			.get("https://api.github.com/user/" + uid)
			.then((response) => {
                myCache.set(key,response["data"])
                resolve(response["data"])
            })
			.catch((error) => {
                console.log("Cannot fetch data from github")
				//reject(error);
			});
        }
        else{
            resolve(value)
        }
		
	});
}

function getCreationDate(githubData) {
    var date = new Date(githubData["created_at"]);
    return Math.floor(date / 1000)
}

module.exports.isCreatedBeforeDate = function(githubData, oldTimestamp) {
    var newTimestamp = getCreationDate(githubData)
    return oldTimestamp > newTimestamp
}

module.exports.getUsername = function(githubData) {
 return githubData['login']
}