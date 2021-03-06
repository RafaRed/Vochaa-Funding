import React, {useState,useEffect} from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { createContest } from "../../model/Calls/Database";


export function AddProjectButton({
	username, contest, buttonStyle,startDate,endDate,repositories,dataChanged,setDataChanged
}) {
	const [valid,setValid] = useState(false)

	const requestProjectCreation = () => {
		if(valid){
			addProject(contest, repositories, startDate,endDate);
		}
		else{
			alert("Please fill all the fields.")
		}
		
	};

	useEffect(()=>{
		setValid(isDataFilled(contest,startDate,endDate,setDataChanged))
	},[dataChanged,startDate,endDate])

	return (
		<button
			type="button"
			onClick={isLoggedIn(username)
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
	if(username === "" || username === undefined){
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

async function addProject(contest,repositories,startDate,endDate) {
	//TODO Verifiy if user is whitelisted
	//TODO Change to server-side
	createContest(contest,startDate,endDate,repositories)
	.then((data)=> window.location.href = "/explore")
	/*const db = getDatabase();
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
	});*/
	//TODO Change to ID
	
}