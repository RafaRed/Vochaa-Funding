import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import "../css/RepositoriesExplorer.css";

function RepositoriesExplorer(props) {
	const [username, setUsername] = useState("");
    const params = useParams();
	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="repositories">
				<div className="wrapper">
					<div className="header">
						<h1 className="title">Tasks</h1>
						<p className="description">
							Search for a project you want to support, voting and sharing your ideas.
						</p>
						<div className="search-bar">
							<input
								type="text"
								id="fname"
								name="fname"
								className="block-input"
								onChange={(val) => props.setSearch(val.target.value)}
							/>
							<img src="/images/search.png" />
						</div>
					</div>

					<div className="block">
						<LoadTasks params={params}></LoadTasks>
					</div>
				</div>
			</div>
		</>
	);
}

function LoadTasks({params}) {
	return [Task(params), Task(params), Task(params), Task(params), Task(params)];
}

function Task(params) {
	return (<a className="contest-button" href={"/contest/"+params.contest+"/taskid"}><div className="repo-task">Task Name</div></a>);
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

export default injectSheet(styles)(RepositoriesExplorer);
