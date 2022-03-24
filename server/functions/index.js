const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase-admin/app");
const responseTime = require("response-time");
const {
	getGithubData,
	isCreatedBeforeDate,
	getUsername,
} = require("./github.js");
const rateLimit = require("express-rate-limit");
var admin = require("firebase-admin");

var serviceAccount = require("./config.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://vochaafunding-default-rtdb.firebaseio.com",
});

//initializeApp();
var db = admin.database();

const app = express();
app.use(cors());
app.use(responseTime());
app.use(
	rateLimit({
		windowMs: 1 * 60 * 60 * 1000, // 12 hour duration in milliseconds
		max: 200,
		message: "You exceeded requests hour limit!",
		headers: true,
	})
);

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post("/auth", (req, res) => {
	var idToken = req.body.idToken;
	getGithubData(idToken).then((data) =>
		console.log("is:" + isCreatedBeforeDate(data, 1647474072))
	);
	res.json({ uid: "githubData" });
});

app.post("/getname", (req, res) => {
	var idToken = req.body.idToken;
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((result) => res.json({ username: result }));
});

app.post("/createcontest", (req, res) => {
	var idToken = req.body.idToken;
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((username) => isWhitelisted(username))
		.then((whitelisted) => {
			if (whitelisted[1] == true) {
				registerContest(req.body, whitelisted[0]);
				res.json({ result: "Created." });
			} else {
				console.log("User not whitelisted, invalid request.");
				res.json({ result: "Unable to create contest." });
			}
		});
});

function isWhitelisted(username) {
	return new Promise((resolve, reject) => {
		var ref = db.ref("/whitelist");
		console.log("Validating " + username);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			if (data[username] === true) {
				resolve([username, true]);
			} else {
				resolve([username, false]);
			}
		});
	});
}

function registerContest(data, username) {
	var ref = db.ref("/contest");
	const contestRef = ref.push();
	contestRef.set({
		name: data.name,
		description: data.description,
		logourl: data.logourl,
		credits: data.credits,
		funding: data.funding,
		startDate: data.startDate,
		endDate: data.endDate,
		timestamp: data.timestamp,
		sender: username,
		votes: 0,
	});

	console.log(contestRef.key);
	for (var i = 0; i < data.repositories.length; i++) {
		var ref = db.ref("/repository/" + contestRef.key);
		const repoRef = ref.push();
		repoRef.set({
			name: data.repositories[i].name,
			description: data.repositories[i].description,
			url: data.repositories[i].url,
		});
	}
}

app.post("/gettasks", (req, res) => {
	var contestid = req.body.contestid;
	var ref = db.ref("/repository/" + contestid);
	ref.once("value", function (snapshot) {
		var data = snapshot.val();
		console.log(data);
		res.json(data);
	});
});

app.post("/updatepullrequests", (req, res) => {
	var idToken = req.body.idToken;
	// CHECK IF IS THE SAME USER OF THE CONTEST CREATOR.
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((username) => isWhitelisted(username))
		.then((whitelisted) => {
			if (whitelisted[1] == true) {
				updatePullRequests(req.body.repositories);
				res.json({ result: "Created." });
			} else {
				console.log("User not whitelisted, invalid request.");
				res.json({ result: "Unable to create contest." });
			}
		});
});

function updatePullRequests(data) {
	for (var i = 0; i < data.length; i++) {
		var newData = {
			pr: data[i].pr,
			title: data[i].title,
			user: data[i].user,
			body: data[i].body,
			url: data[i].url,
			repository: data[i].repository,
			contestid: data[i].contestid,
			created: data[i].created,
			enabled: data[i].enabled,
		};
		addPullRequest(newData);
	}
}

function addPullRequest(data) {
	console.log(data);
	var ref = db.ref(
		"/pullrequests/" + data.contestid + "/" + data.repository + "/" + data.pr
	);
	ref.set(data);
}

app.post("/getpullrequests", (req, res) => {
	var contestid = req.body.contestid;
	var ref = db.ref("/pullrequests/" + contestid);
	ref.once("value", function (snapshot) {
		var data = snapshot.val();
		var pullrequests = [];
		for (const [user_key, user_value] of Object.entries(data)) {
			for (const [repo_key, repo_value] of Object.entries(data[user_key])) {
				for (const [pullrequest_key, pullrequest_value] of Object.entries(
					data[user_key][repo_key]
				)) {
					pullrequests.push(data[user_key][repo_key][pullrequest_key]);
				}
			}
		}
		console.log(pullrequests)
		res.json(pullrequests);
	});
});

app.post("/gettask", (req, res) => {
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var taskData;
	var task = {};

	getTask(contestid, repositoryid)
		.then((result) => {
			taskData = result;
		})
		.then(() => getTaskPullRequests(contestid, taskData))
		.then((result) => {
			task["name"] = taskData.name;
			task["description"] = taskData.description;
			task["url"] = taskData.url;
			task["pullrequests"] = result;
		})
		.then(() => getContest(contestid))
		.then((result) => {
			task["contest-name"] = result.name;
			task["contest-description"] = result.description;
			task["contest-funding"] = result.funding;
			task["contest-startDate"] = result.startDate;
			task["contest-endDate"] = result.endDate;
			task["contest-logourl"] = result.logourl;
			res.json(task);
		});
});

app.post("/getpullrequest", (req, res) => {
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var pullrequestid = req.body.pullrequestid;
	var taskData;
	var repositoryPath;

	getTask(contestid, repositoryid)
		.then((result) => {
			taskData = result;
		})
		.then(() => {
			repositoryPath = taskData.url.split("/");
			repositoryPath =
				repositoryPath[repositoryPath.length - 2] +
				"/" +
				repositoryPath[repositoryPath.length - 1];
		})
		.then(() => getPullrequest(contestid, repositoryPath, pullrequestid))
		.then((data) => res.json(data));
});

function getTask(contestid, repositoryid) {
	return new Promise((resolve, reject) => {
		var ref = db.ref("/repository/" + contestid + "/" + repositoryid);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			resolve(data);
		});
	});
}

function getPullrequest(contestid, repositoryPath, pullrequestid) {
	return new Promise((resolve, reject) => {
		var ref = db.ref(
			"/pullrequests/" + contestid + "/" + repositoryPath + "/" + pullrequestid
		);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			console.log(data);
			resolve(data);
		});
	});
}

function getContest(contestid) {
	console.log("fetching  " + contestid);
	return new Promise((resolve, reject) => {
		var ref = db.ref("/contest/" + contestid);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			console.log(data);
			resolve(data);
		});
	});
}

function getTaskPullRequests(contestid, repository) {
	return new Promise((resolve, reject) => {
		var repositoryPath = repository.url.split("/");
		repositoryPath =
			repositoryPath[repositoryPath.length - 2] +
			"/" +
			repositoryPath[repositoryPath.length - 1];
		var ref = db.ref("/pullrequests/" + contestid + "/" + repositoryPath);
		ref.once("value", function (snapshot) {
			var pullrequests = [];
			if (snapshot.exists()) {
			var data = snapshot.val();
			
			for (const [pullrequest_key, pullrequest_value] of Object.entries(data)) {
				if (data[pullrequest_key]["enabled"] == true) {
					pullrequests.push(data[pullrequest_key]);
				}
			}
		}
			resolve(pullrequests);
		});
	});
}

app.post("/getvotes", (req, res) => {
	var votes = 0;
	var totalVotes = 0;
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var pullrequestid = req.body.pullrequestid;

	getPullrequestVotes(contestid,repositoryid,pullrequestid)
	.then(result => {votes=result})
	.then(()=> getContestVotes(contestid))
	.then(result => {
		totalVotes = result;
		console.log(votes, totalVotes);
		res.json({"votes":votes, "totalVotes":totalVotes})
	})

	
});

function getContestVotes(contestid) {
	return new Promise((resolve, reject) => {
		var ref = db.ref(
			"/contest/" + contestid
		);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			votes = data.votes;
			resolve(votes);
		});
	});
}

function getPullrequestVotes(contestid, repositoryid, pullrequestid){
	var votes = 0;
	return new Promise((resolve,reject)=>{
		var ref = db.ref(
			"/votes/" + contestid + "/" + repositoryid + "/" + pullrequestid
		);
		ref.once("value", function (snapshot) {
			
			if (snapshot.exists()) {
				var data = snapshot.val();
				votes = data.votes;
			}
	
			resolve(votes)
		});
	})
}

exports.app = functions.https.onRequest(app);
