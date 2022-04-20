import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import "../css/RepositoriesExplorer.css";
import {
	getContest,
	getPullRequests,
	loadTasks,
} from "../model/Calls/Database";
import ReactMarkdown from "react-markdown";
import { backButton, fetchContestCredits } from "../utils/utils";
import { auth, provider } from "../model/firebaseConnect";
import { onAuthStateChanged } from "firebase/auth";

function RepositoriesExplorer(props) {
	const [username, setUsername] = useState("");
	const params = useParams();
	const [taskList, setTaskList] = useState([]);
	const [contest, setContest] = useState({});
	const [description, setDescription] = useState();
	const [readMore, setReadMore] = useState(false);
	const [userCredits, setUserCredits] = useState();
	const linkName = readMore ? "Read Less << " : "Read More >> ";
	useEffect(() => {
		FetchContest(params.contest, setContest, setDescription);
	}, []);

	useEffect(() => {
		onAuthStateChanged(auth, (currentUser) => {
			fetchContestCredits(params.contest, setUserCredits);
			console.log(userCredits);
		});
	}, []);

	return (
		<>
			<Navbar
				menu="explore"
				username={username}
				setUsername={setUsername}
				userCredits={userCredits}
			/>
			<div className="repositories">
				<div className="wrapper">
					<div className="header">
						<div className="top">
							<div
								onClick={() => backButton("../../../../explore")}
								className={["back-button", props.classes.button].join(" ")}>
								<img src="/images/back.png"></img>
								<p>BACK</p>
							</div>

							<p className="title">{contest.name}</p>
						</div>

						<p className="block-description">
							<ReactMarkdown className={readMore ? "readmore" : "readless"}>
								{description}
							</ReactMarkdown>
							<a
								className="read-more-link"
								onClick={() => {
									setReadMore(!readMore);
								}}>
								<p className="read-more-text">{linkName}</p>
							</a>
						</p>
					</div>

					<div className="tasks">
						<h2 className="tasks-title">Repositories</h2>
						<LoadTasks
							params={params}
							taskList={taskList}
							setTaskList={setTaskList}></LoadTasks>
					</div>
				</div>
			</div>
		</>
	);
}

function FetchContest(contestid, setContest, setDescription) {
	getContest(contestid).then((data) => {
		setContest(data);
		formatDescription(data.description, setDescription);
	});
}

function formatDescription(description, setDescription) {
	var newDescription = description;
	newDescription = newDescription.replace("  ", "");
	setDescription(newDescription);
}

function getRepositoryFromUrl(url) {
	var repositoryPath = url.split("/");
	repositoryPath =
		repositoryPath[repositoryPath.length - 2] +
		"/" +
		repositoryPath[repositoryPath.length - 1];
		return repositoryPath;
}

function LoadTasks({ params, taskList, setTaskList }) {
	useEffect(() => {
		var newTaskList = [];
		var repositories = {}
		getPullRequests(params.contest).then((pullrequests) => {
			
			for (const [key, value] of Object.entries(pullrequests)) {
				if(pullrequests[key].enabled === true){
					if(pullrequests[key].repository in repositories)
				{
					repositories[pullrequests[key].repository] ++;
				}
				else{
					repositories[pullrequests[key].repository] = 1;
				}
				}
				
			}

			loadTasks(params.contest).then((tasks) => {
				for (const [key, value] of Object.entries(tasks)) {
					console.log(tasks[key]);
					var repositoryPath = getRepositoryFromUrl(tasks[key].url);
					newTaskList.push(Task(tasks[key], key, params.contest, repositories[repositoryPath]));
				}
				setTaskList(newTaskList);
			});
		});
		
	}, []);

	return taskList;
}

function Task(task, key, contestid, repositories) {
	return (
		<a
			className="contest-button"
			key={key}
			href={"/contest/" + contestid + "/" + key + "/"}>
			<div className="repo-task">{task["name"]} ({repositories})</div>
		</a>
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

export default injectSheet(styles)(RepositoriesExplorer);
