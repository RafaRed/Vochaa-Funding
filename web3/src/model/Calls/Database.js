import {
	server,
	createcontest_path,
	gettasks_path,
	updatepullrequests_path,
	getpullrequests_path,
	gettask_path,
	getpullrequest_path,
	getvotes_path,
	sendvotes_path,
	getpullrequestvotes_path,
    getcredits_path,
	getwhitelisted_path,
	getprojects_path,
	getcontest_path,
	exportcontest_path,
	updatecontest_path,
	getvoters_path,
	credits_path
} from "../repository";
import moment from "moment";
import { getIdToken, getUsername } from "./Auth";

export async function createContest(contest, startDate, endDate, repositories) {
	var idToken = await getIdToken();

	var data = {
		name: contest.name,
		description: contest.description,
		logourl: contest.logourl,
		credits: contest.credits,
		funding: contest.funding,
		startDate: startDate.unix(),
		endDate: endDate.unix(),
		timestamp: moment().unix(),
		idToken: idToken,
		currency: contest.currency,
		showvoters: contest.showvoters,
		repositories: repositories,
	};

	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + createcontest_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function loadTasks(contestid) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ contestid: contestid }),
	};
	return new Promise((resolve, reject) => {
		fetch(server + gettasks_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function updatePullRequests(contestid, data) {
	var idToken = await getIdToken();

	var newdata = {};
	newdata["idToken"] = idToken;
	newdata["repositories"] = data;
	newdata["contestid"] = contestid;

	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newdata),
	};
	return new Promise((resolve, reject) => {
		fetch(server + updatepullrequests_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getPullRequests(contestid) {
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ contestid: contestid }),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getpullrequests_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getTask(contestid, repositoryid) {
	var data = { contestid: contestid, repositoryid: repositoryid };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + gettask_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getPullrequest(contestid, repositoryid, pullrequestid) {
	var data = {
		contestid: contestid,
		repositoryid: repositoryid,
		pullrequestid: pullrequestid,
	};
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getpullrequest_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getVotes(contestid, repositoryid, pullrequestid) {
	var data = {
		contestid: contestid,
		repositoryid: repositoryid,
		pullrequestid: pullrequestid,
	};
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getvotes_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function sendVotes(contestid, repositoryid, pullrequestid, votes) {
	var idToken = await getIdToken();
	var data = {
		contestid: contestid,
		repositoryid: repositoryid,
		pullrequestid: pullrequestid,
		votes: votes,
		idToken: idToken,
	};
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + sendvotes_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getAllPullrequestsVotes(contestid, repositoryid) {
	var data = { contestid: contestid, repositoryid: repositoryid };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getpullrequestvotes_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getCredits(contestid,repositoryid,pullrequestid) {
	var idToken = await getIdToken();
	var data = { contestid: contestid,repositoryid:repositoryid,pullrequestid:pullrequestid,idToken: idToken };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getcredits_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getWhitelisted() {
	var idToken = await getIdToken();
	var data = { idToken: idToken };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getwhitelisted_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getProjects() {

	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	};
	return new Promise((resolve, reject) => {
		fetch(server + getprojects_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getContest(contestid) {
	var data = { contestid: contestid};
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getcontest_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getExportData(contestid) {
	var idToken = await getIdToken();
	
	var data = { idToken: idToken, contestid: contestid };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + exportcontest_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getUpdateContest(contestid,contestName,contestDescription) {
	var idToken = await getIdToken();
	var data = { idToken: idToken, contestid: contestid,contestName:contestName,contestDescription:contestDescription};
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + updatecontest_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getVoters(contestid,repositoryid,pullrequestid) {

	var data = { contestid: contestid, repositoryid:repositoryid, pullrequestid:pullrequestid };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + getvoters_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}

export async function getUserCredits(contestid) {
	var idToken = await getIdToken();
	var data = { contestid: contestid, idToken:idToken };
	const requestOptions = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(data),
	};
	return new Promise((resolve, reject) => {
		fetch(server + credits_path, requestOptions)
			.then((response) => response.json())
			.then((data) => resolve(data));
	});
}