import "../css/App.css";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import {useEffect, useState} from "react"
import { getWhitelisted } from "../model/Calls/Database";
import { auth, provider } from "../model/firebaseConnect";
import {
	onAuthStateChanged,
} from "firebase/auth";

function App() {
	const [username, setUsername] = useState("");
	const [whitelisted, setWhitelisted] = useState(false)
	useEffect(()=>{
		onAuthStateChanged(auth, (currentUser) => {
		getWhitelisted()
		.then(result => 
			{
				setWhitelisted(result.result)
			})
		})
		
	},[])
	return (
		<div className="App">
			<Navbar menu="home" username={username} setUsername={setUsername}/>
			<div className="header">
				<div className="horizontalBar"></div>
				<div>
					<Title />
					<ProjectDescription />
				</div>
			</div>
			<div className="cards">
				<div className="card1">
					<Card
						img="images/avatar1.png"
						name="Add a Contest"
						desc="Set up a Quadratic Voting Contest."
						button="CREATE"
						link="create-contest"
						whitelisted={whitelisted}
						checkwhitelisted={true}
					/>
				</div>
				<div className="card2">
					<Card
						img="images/avatar2.png"
						name="Explore Contests"
						desc="Discover the contests, join and help voting."
						button="EXPLORE"
						link="/explore"
						checkwhitelisted={false}
					/>
				</div>
			</div>
		</div>
	);
}

function Title() {
	return (
		<h1 className="title">
			Join <span className="app-name">Vochaa</span>
		</h1>
	);
}

function ProjectDescription() {
	return (
		<p className="description">
			Be part of the community by adding new contests, joining contests
			<br></br> and voting for your favorite proposals using quadratic
			voting.
		</p>
	);
}

export default App;
