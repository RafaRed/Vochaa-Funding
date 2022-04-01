import { getUserCredits } from "../model/Calls/Database";

//TODO Choose a better name
export function numericValidator(value)
{
	if(value === undefined || isNaN(value)){
		return 0;
	}
	return value;
}
export function backButton(destination){
	window.location.href = window.location.href+destination;
}

export function fetchContestCredits(contestid, setCredits){
	console.log("start")
	getUserCredits(contestid)
	.then(result => {setCredits(numericValidator(result.credits))})

}