import injectSheet from "react-jss";
import {useState} from 'react';
import { GithubAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {auth,provider} from '../model/firebaseConnect'


function ConnectGitHub(props) {
    onAuthStateChanged(auth,(currentUser) =>{
        RecoverUsername(currentUser,props.setUsername)
    })
    
    return props.username !== "" ? UserButton(props.username,props.classes.clickable) : LoginButton(props.setUsername,props.classes.clickable)
	
}


async function RecoverUsername(currentUser,setUsername){

    
    if(currentUser != null){
        var uid = currentUser.providerData[0].uid;
        await fetch('https://api.github.com/user/'+uid)
        .then(response => response.json())
        .then(data => setUsername(data.login));
    }
    else{
        setUsername("")
    }
    
}

async function signout(){
    await signOut(auth);
}

function LoginButton(setUsername,buttonStyle){
    return (
		<button
			onClick={()=>login(setUsername)}
			className={["metamask", buttonStyle].join(" ")}>
			Connect GitHub
		</button>)
        ;
}

function UserButton(username,buttonStyle){
    return (
		<button
            onClick={signout}
			className={["metamask", buttonStyle].join(" ")}>
			{username}
		</button>)
        ;
}



function login(setUsername) {
    signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        //const token = credential.accessToken;

        // The signed-in user info.
        //const user = result.user;
        //setUsername(user.reloadUserInfo.screenName)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
    });
}

const styles = {
	clickable: {
		backgroundColor: "#3191FF",
		"&:hover": {
			backgroundColor: "#40a9ff",
		},
	},
	logged: {
		backgroundColor: "#4982c4",
	},
};

export default injectSheet(styles)(ConnectGitHub);
