import "../css/App.css";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

function App() {
	return (
		<div className="App">
			<Navbar menu="home" />
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
						name="Add a Project"
						desc="Set up Quadratic Voting for a project."
						button="CREATE"
						link="create-project"
					/>
				</div>
				<div className="card2">
					<Card
						img="images/avatar2.png"
						name="Explore Projects"
						desc="Discover the projects and help by voting."
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
