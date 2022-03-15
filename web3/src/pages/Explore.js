import React, { useState } from "react";
import "../css/Explore.css";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import firebase from "../model/firebaseConnect";
import { SearchBar } from "../components/Explore/SearchBar";
import { CreateBoard } from "../components/Explore/CreateBoard";
import { AddProject } from "../components/Explore/AddProject";
import { GetProjects } from "../components/Explore/GetProjects";



function Explore(props) {
	const [projects, setProjects] = useState();
	const [search, setSearch] = useState();

	GetProjects(setProjects);

	return (
		<>
			<Navbar menu="explore" />
			<div className="explore">
				<div className="wrapper">
					<div className="header">
						<Title></Title>
						<Description></Description>
						<SearchBar setSearch={setSearch}></SearchBar>
						<AddProject links={props.classes.links}></AddProject>
					</div>
					<div className="board">
						<CreateBoard
							projects={projects}
							classes={props.classes}
							search={search}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

function Title() {
	return <h1 className="title">Projects</h1>;
}

function Description() {
	return (
		<p className="description">
			Search for a project you want to support, voting and sharing your ideas.
		</p>
	);
}

const styles = {
	links: {
		textDecoration: "none",
		color: "#fff",
		"&:hover": {
			color: "#3191FF",
		},
	},
	app: {
		backgroundColor: "#95c3f7",
		"&:hover": {
			backgroundColor: "#aed4ff",
		},
	},
};

export default injectSheet(styles)(Explore);
