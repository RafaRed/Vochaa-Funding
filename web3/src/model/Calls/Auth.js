import { auth, provider } from "../firebaseConnect";
import {server,auth_path, getname_path} from "../repository"

function requestAuth(idToken){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "idToken": idToken })
    };
    return new Promise((resolve,reject)=>{
        fetch(server+auth_path, requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
    })

}

export function getIdToken(){
    return new Promise((resolve,reject) => {
        auth.currentUser.getIdToken()
        .then((idToken) => resolve(idToken))
    })

}


export async function getUsername(){
    var idToken = await getIdToken()
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "idToken": idToken })
    };
    return new Promise((resolve,reject)=>{
        fetch(server+getname_path, requestOptions)
        .then(response => response.json())
        .then(data => resolve(data['username']));
    })
}

export function getAuth() {
	return new Promise((resolve, reject) => {
		auth.currentUser
			.getIdToken()
			.then(function (idToken) {
				resolve(requestAuth(idToken))
			})
			.catch(function (error) {
				reject(error)
			});
	});
}
