import React from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import moment from "moment";

export function AddProjectButton({
	username, contest, buttonStyle,startDate,endDate
}) {

	const requestProjectCreation = () => {
		addProject(contest, username,startDate,endDate);
	};

	return (
		<button
			type="button"
			onClick={isLoggedIn
				? requestProjectCreation
				: () => alert("Please connect to your account first.")}
			className={[
				isDataFilled(contest)
					? buttonStyle
					: "",
					isDataFilled(contest)
					? "add-button"
					: "add-button-off",
			].join(" ")}>
			ADD THIS CONTEST
		</button>
	);
}

function isLoggedIn(username){
	//TODO Validade Login
	if(username === ""){
		return false
	}
	else{
		return true
	}
}

function isDataFilled(contest){
	return true
}

async function addProject(contest, username,startDate,endDate) {
	//TODO Verifiy if user is whitelisted
	//TODO Change to server-side
	const db = getDatabase();
	await set(ref(db, "contest/" + contest.name), {
		name: contest.name,
		description: contest.description,
		logourl: contest.logourl,
		credits: contest.credits,
		funding: contest.funding,
		startDate: startDate.unix(),
		endDate: endDate.unix(),
		timestamp: moment().unix(),
		sender: username,
	});
	//TODO Change to ID
	window.location.href = "/contest" + "/" + contest.name;
}