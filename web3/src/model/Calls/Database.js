import { server, createcontest_path } from "../repository";
import moment from "moment";
import { getIdToken } from "./Auth";

export async function createContest(contest,startDate,endDate,repositories){
    var idToken = await getIdToken()

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
        repositories: repositories
    }
    

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    return new Promise((resolve,reject)=>{
        fetch(server+createcontest_path, requestOptions)
        .then(response => response.json())
        .then(data => resolve(data));
    })


}