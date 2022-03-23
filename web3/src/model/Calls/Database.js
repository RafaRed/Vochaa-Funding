import { server, createcontest_path, gettasks_path, updatepullrequests_path, getpullrequests_path } from "../repository";
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

export async function loadTasks(contestid){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"contestid":contestid})
    };
    return new Promise((resolve,reject)=>{
        fetch(server+gettasks_path, requestOptions)
        .then(response => response.json())
        .then(data => resolve(data));
    })
}

export async function updatePullRequests(contestid, data){
    var idToken = await getIdToken()

    var newdata = {}
    newdata['idToken'] = idToken
    newdata['repositories'] = data
    newdata['contestid'] = contestid

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newdata)
    };
    return new Promise((resolve,reject)=>{
        fetch(server+updatepullrequests_path, requestOptions)
        .then(response => response.json())
        .then(data => resolve(data));
    })

}

export async function getPullRequests(contestid){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"contestid":contestid})
    };
    return new Promise((resolve,reject)=>{
        fetch(server+getpullrequests_path, requestOptions)
        .then(response => response.json())
        .then(data => resolve(data));
    })
}