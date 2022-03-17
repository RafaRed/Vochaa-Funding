import "../css/App.css";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import {useState} from "react"

function App() {
	const [username, setUsername] = useState("");
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
					/>
				</div>
				<div className="card2">
					<Card
						img="images/avatar2.png"
						name="Explore Contests"
						desc="Discover the contests and help by voting."
						button="EXPLORE"
						link="/explore"
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
			Be part of the community by adding new projects, suggesting new proposals
			<br></br> and voting for your favorite blockchain proposals using quadratic
			voting systems.
		</p>
	);
}

export default App;
