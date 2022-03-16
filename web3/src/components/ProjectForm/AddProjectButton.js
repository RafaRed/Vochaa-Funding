import React, {useState,useEffect} from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import moment from "moment";

export function AddProjectButton({
	username, contest, buttonStyle,startDate,endDate,dataChanged,setDataChanged
}) {
	const [valid,setValid] = useState(false)

	const requestProjectCreation = () => {
		addProject(contest, username,startDate,endDate);
	};

	useEffect(()=>{
		setValid(isDataFilled(contest,startDate,endDate,setDataChanged))
	},[dataChanged,startDate,endDate])

	return (
		<button
			type="button"
			onClick={isLoggedIn
				? requestProjectCreation
				: () => alert("Please connect to your account first.")}
			className={[
				valid
					? buttonStyle
					: "",
					valid
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

function isDataFilled(contest,startDate,endDate,setDataChanged){
	//TODO CHECK IF IMAGE IS VALID
	//TODO CHECK IF REPOSITORIES ARE FILLED
	//TOOD CHECK IF DATE IS VALID
	var fields = ["name","description","logourl","credits","funding"];
	var filled = true;
	for(var i = 0; i<fields.length; i++){
		if(contest[fields[i]] === undefined || contest[fields[i]] === "" || contest[fields[i]] === 0){
			filled = false
			console.log(contest[fields[i]])
		}
	}
	if(startDate === undefined || endDate === undefined){
		filled = false
	}
	setDataChanged(false)
	return filled
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