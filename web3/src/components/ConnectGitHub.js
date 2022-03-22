import injectSheet from "react-jss";
import { useState } from "react";
import {
	GithubAuthProvider,
	signInWithPopup,
	onAuthStateChanged,
	signOut,
} from "firebase/auth";
import { auth, provider } from "../model/firebaseConnect";
import { getAuth, getUsername } from "../model/Calls/Auth";
import { connect } from "react-redux";

import store from '../store';
import {saveState, loadState} from '../store/localstorage';


function SaveUsername(){
    store.subscribe(()=>{
        saveState({
            username: store.getState().username
        })
    })
}

function ConnectGitHub(props) {
    
	onAuthStateChanged(auth, (currentUser) => {
		RecoverUsername(currentUser, props.setUser, props.user);
		//getAuth().then(data => console.log(data))
	});
	props.setUsername(props.user)
	return props.user !== ""
		? UserButton(props.user, props.classes.clickable, props.setUser)
		: LoginButton(props.setUser, props.classes.clickable);
}

async function RecoverUsername(currentUser, setUsername, user) {
    
        if (currentUser != null) {
            if(user === ""){
                var username = await getUsername();
                setUsername(username);
                SaveUsername()
                
            }
            else{
                //console.log("load from cache")
                setUsername(user)
            }
            
        } else {
            setUsername("");
            SaveUsername()
            
        }
        
}

async function signout(setUser) {
	await signOut(auth);

}

function LoginButton(setUsername, buttonStyle) {
	return (
		<button
			onClick={() => login(setUsername)}
			className={["metamask", buttonStyle].join(" ")}>
			Connect GitHub
		</button>
	);
}

function UserButton(username, buttonStyle, setUser) {
	return (
		<button
			onClick={() => signout(setUser)}
			className={["metamask", buttonStyle].join(" ")}>
			{username}
		</button>
	);
}

function login(setUsername) {
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GithubAuthProvider.credentialFromResult(result);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			const email = error.email;
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

const mapStateToProps = (state) => ({
	user: state.username,
});

const mapDispatchToProps = (dispatch) => ({
	setUser: (username) => dispatch({ type: "SET", payload: { username } }),
});

export default injectSheet(styles)(
	connect(mapStateToProps, mapDispatchToProps)(ConnectGitHub)
);
