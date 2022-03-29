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
		max: 300,
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
		//console.log(data);
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
	//console.log(data);
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
					var newData = data[user_key][repo_key][pullrequest_key];
					newData["key"] = pullrequest_key;
					pullrequests.push(newData);
				}
			}
		}
		//console.log(pullrequests);
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
			//console.log(data);
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
			//console.log(data);
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
						var newData = data[pullrequest_key];
						newData["key"] = pullrequest_key;
						pullrequests.push(newData);
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
	var funding = 0;
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var pullrequestid = req.body.pullrequestid;

	getPullrequestVotes(contestid, repositoryid, pullrequestid)
		.then((result) => {
			votes = result;
		})
		.then(() => getContestVotes(contestid))
		.then((result) => {
			totalVotes = result.votes;

			res.json({
				votes: votes,
				totalVotes: totalVotes,
				funding: result.funding,
				startDate: result.startDate,
				endDate: result.endDate,
			});
		});
});

function getContestVotes(contestid) {
	return new Promise((resolve, reject) => {
		var ref = db.ref("/contest/" + contestid);
		ref.once("value", function (snapshot) {
			var data = snapshot.val();
			votes = data.votes;
			resolve({
				votes: votes,
				funding: data.funding,
				startDate: data.startDate,
				endDate: data.endDate,
			});
		});
	});
}

function getPullrequestVotes(contestid, repositoryid, pullrequestid) {
	var votes = 0;
	return new Promise((resolve, reject) => {
		var ref = db.ref(
			"/votes/" + contestid + "/" + repositoryid + "/" + pullrequestid
		);
		ref.once("value", function (snapshot) {
			if (snapshot.exists()) {
				var data = snapshot.val();
				votes = data.votes;
			}

			resolve(votes);
		});
	});
}

app.post("/sendvotes", (req, res) => {
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var pullrequestid = req.body.pullrequestid;
	var idToken = req.body.idToken;
	var votes = req.body.votes;
	var githubData;
	var username;
	var idToken = req.body.idToken;
	var oldVotes = 0;
	if (votes > 0) {
		getGithubData(idToken)
			.then((data) => {
				githubData = data;
			})
			.then(() => getUsername(githubData))
			.then((result) => {
				username = result;
				if (isAllowedToVote(githubData, contestid)) {
					getUserOlderVotes(username, contestid, repositoryid, pullrequestid).then(
						(result) => {
							oldVotes = result;
							userHaveCredits(username, votes, oldVotes, contestid).then(
								(haveCredits) => {
									if (haveCredits) {
										vote(
											username,
											contestid,
											repositoryid,
											pullrequestid,
											votes,
											oldVotes
										);
										res.json({ status: "vote registered" });
									}
								}
							);
						}
					);
				} else {
					res.json({ error: "User created after event starting date" });
				}
			});
	} else {
		res.json({ status: "invalid votes amount" });
	}
});

function isAllowedToVote(githubData, contestid) {
	getContest(contestid).then((result) => {
		if (isCreatedBeforeDate(githubData, result.startDate)) {
			return true;
		} else {
			return false;
		}
	});

	return true;
}
function userHaveCredits(username, votes, oldVotes, contestid) {
	return new Promise((resolve, reject) => {
		getUserCredits(username, contestid).then((userCredits) => {
			resolve(userCredits >= (votes + oldVotes) ** 2 - oldVotes ** 2);
		});
	});
}

function vote(
	username,
	contestid,
	repositoryid,
	pullrequestid,
	votes,
	oldVotes
) {
	//console.log(votes);
	var ref = db.ref(
		"/votes" +
			"/" +
			contestid +
			"/" +
			repositoryid +
			"/" +
			pullrequestid +
			"/voters"
	);
	const votersRef = ref.push();
	votersRef.set({
		username: username,
		votes: votes,
		timestamp: Date.now(),
	});

	var voteRef = db.ref(
		"/votes" +
			"/" +
			contestid +
			"/" +
			repositoryid +
			"/" +
			pullrequestid +
			"/votes"
	);
	voteRef.transaction((current_value) => {
		return (current_value || 0) + votes;
	});
	var userCredits = db.ref(
		"/users" + "/" + username + "/" + contestid + "/credits"
	);

	userCredits.transaction((current_value) => {
		return (current_value || 0) - ((votes + oldVotes) ** 2 - oldVotes ** 2);
	});

	var userPullrequestVotes = db.ref(
		"/users" +
			"/" +
			username +
			"/" +
			contestid +
			"/prs/" +
			repositoryid +
			"/" +
			pullrequestid +
			"/votes"
	);

	userPullrequestVotes.transaction((current_value) => {
		return (current_value || 0) + votes;
	});

	var contestVotesRef = db.ref("/contest" + "/" + contestid + "/votes");
	contestVotesRef.transaction((current_value) => {
		return (current_value || 0) + votes;
	});
}

app.post("/getpullrequestsvotes", (req, res) => {
	var votes = {};
	var totalVotes = 0;
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;

	getAllPullrequestVotes(contestid, repositoryid)
		.then((result) => {
			votes = result;
		})
		.then(() => getContestVotes(contestid))
		.then((result) => {
			totalVotes = result.votes;

			res.json({
				votes: votes,
				totalVotes: totalVotes,
				funding: result.funding,
				startDate: result.startDate,
				endDate: result.endDate,
			});
		});
});

function getAllPullrequestVotes(contestid, repositoryid) {
	var votes = {};
	return new Promise((resolve, reject) => {
		var ref = db.ref("/votes/" + contestid + "/" + repositoryid);
		ref.once("value", function (snapshot) {
			if (snapshot.exists()) {
				var data = snapshot.val();
				for (const [pullrequest_key, pullrequest_value] of Object.entries(data)) {
					votes[pullrequest_key] = data[pullrequest_key].votes;
				}
			}

			resolve(votes);
		});
	});
}

app.post("/getusercredits", (req, res) => {
	var idToken = req.body.idToken;
	var contestid = req.body.contestid;
	var repositoryid = req.body.repositoryid;
	var pullrequestid = req.body.pullrequestid;
	var username;
	var data = {};
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((result) => {
			username = result;
		})
		.then(() => getUserCredits(username, contestid))
		.then((result) => {
			data["credits"] = result;
		})
		.then(() =>
			getUserOlderVotes(username, contestid, repositoryid, pullrequestid)
		)
		.then((result) => {
			data["oldVotes"] = result;
			res.json(data);
		});
});

function getUserCredits(username, contestid) {
	return new Promise((resolve, reject) => {
		var credits = 0;
		var ref = db.ref("/users/" + username + "/" + contestid + "/" + "credits");
		ref.once("value", function (snapshot) {
			if (snapshot.exists()) {
				credits = snapshot.val();
				resolve(credits);
			} else {
				redeemUserCredits(username, contestid).then((result) => {
					credits = result;
					resolve(credits);
				});
			}
		});
	});
}

function redeemUserCredits(username, contestid) {
	return new Promise((resolve, reject) => {
		var credits = 0;
		var contestsRef = db.ref("/contest/" + contestid + "/" + "credits");
		contestsRef.once("value", function (snapshot) {
			if (snapshot.exists()) {
				credits = snapshot.val();
				setUserCredits(username, contestid, credits).then((result) =>
					resolve(result)
				);
			} else {
				("contest credits not found");
			}
		});
	});
}

function setUserCredits(username, contestid, credits) {
	return new Promise((resolve, reject) => {
		var ref = db.ref("/users/" + username + "/" + contestid);
		ref.set({ credits: credits });
		resolve(credits);
	});
}

function getUserOlderVotes(username, contestid, repositoryid, pullrequestid) {
	return new Promise((resolve, reject) => {
		console.log(username, contestid, repositoryid, pullrequestid);
		var oldVotes = 0;
		var userPullrequestVotes = db.ref(
			"/users" +
				"/" +
				username +
				"/" +
				contestid +
				"/prs/" +
				repositoryid +
				"/" +
				pullrequestid +
				"/votes"
		);
		userPullrequestVotes.once("value", function (snapshot) {
			if (snapshot.exists()) {
				oldVotes = snapshot.val();
			}
			console.log(oldVotes);
			resolve(oldVotes);
		});
	});
}

app.post("/getwhitelisted", (req, res) => {
	var idToken = req.body.idToken;
	console.log(idToken);
	var username;
	if (idToken === null || idToken === undefined) {
		resolve(false);
	}
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((result) => {
			username = result;
		})
		.then(() =>
			isWhitelisted(username).then((result) => {
				res.json({ result: result[1] });
			})
		);
});

app.post("/getprojects", (req, res) => {
	var ref = db.ref("/contest/");
	ref.once("value", function (snapshot) {
		const projectList = {};
		const data = snapshot.val();
		if (snapshot.exists()) {
			for (let project in data) {
				projectList[project] = data[project];
			}
		}
		res.json(projectList);
	});
});

app.post("/getcontest", (req, res) => {
	var contestid = req.body.contestid;
	var ref = db.ref("/contest/" + contestid);
	ref.once("value", function (snapshot) {
		const data = snapshot.val();
		if (snapshot.exists()) {
			res.json(data);
		}
	});
});

app.post("/exportcontest", (req, res) => {
	var contestid = req.body.contestid;
	var idToken = req.body.idToken;
	var repositories = {};
	var contestFunding;
	var contestVotes;
	var pullrequests = {};
	getGithubData(idToken)
		.then((data) => getUsername(data))
		.then((username) => isWhitelisted(username))
		.then((whitelisted) => {
			if (whitelisted[1] == true) {
				var ref = db.ref("/contest/" + contestid);
				ref.once("value", function (snapshot) {
					const data = snapshot.val();
					if (snapshot.exists()) {
						contestFunding = data.funding;
						contestVotes = data.votes;
					}
				});
				getRepositories(contestid)
					.then((result) => {
						repositories = result;
					})
					.then(() => getPullRequests(contestid,repositories))
					.then((result) => {
						pullrequests = result;
					})
					.then(() => getVotes(contestid, pullrequests,repositories))
					.then((result) => {
						pullrequests = result;
						res.json({
							contestFunding: contestFunding,
							contestVotes: contestVotes,
							pullrequests: pullrequests,
						});
					});
			}
			else{
				res.json({"response":"User not allowed to perform this operation"})
			}
		});
});

function getRepositories(contestid) {
	return new Promise((resolve, reject) => {
		var refRepo = db.ref("/repository/" + contestid);
		refRepo.once("value", function (snapshot) {
			//whitelist check
			const data = snapshot.val();
			if (snapshot.exists()) {
				resolve(data);
			}
		});
	});
}

function getPullRequests(contestid,repositories) {
	return new Promise((resolve, reject) => {
		var refPullrequests = db.ref("/pullrequests/" + contestid);
		refPullrequests.once("value", function (snapshot) {
			if (snapshot.exists()) {
				var pullrequests = {};
				var data = snapshot.val();
				for (const [user_key, user_value] of Object.entries(data)) {
					for (const [repo_key, repo_value] of Object.entries(data[user_key])) {
						var repositoryid = getRepositoryId(user_key,repo_key,repositories)
						pullrequests[repositoryid] = {}
						for (const [pullrequest_key, pullrequest_value] of Object.entries(
							data[user_key][repo_key]
						)) {
							

							pullrequests[repositoryid][pullrequest_key] = data[user_key][repo_key][pullrequest_key];
						}
					}
				}
				
			}
			resolve(pullrequests);
		});
	});
}

function getRepositoryId(user,repo,repositories){
	for (const [repo_key, repo_value] of Object.entries(repositories)) {
		repositoryPath = repositories[repo_key].url.split("/");
		if(repositoryPath[repositoryPath.length - 2] === user && repositoryPath[repositoryPath.length - 1] === repo){
			//console.log(repo_key)
			return repo_key;
		}
	}
	
}

function getVotes(contestid, pullrequests) {
	console.log("getvotes")
	return new Promise((resolve, reject) => {
		var refVotes = db.ref("/votes/" + contestid);
		refVotes.once("value", function (snapshot) {
			if (snapshot.exists()) {
				var data = snapshot.val();
				

				for (const [repo_key, repo_value] of Object.entries(data)) {
					
					for (const [pullrequest_key, pullrequest_value] of Object.entries(data[repo_key])) {
						pullrequests[repo_key][pullrequest_key]["votes"] = data[repo_key][pullrequest_key]["votes"];
					}
				}
				//console.log(pullrequests)
				resolve(pullrequests);
			}
		});
	});
}

exports.app = functions.https.onRequest(app);
