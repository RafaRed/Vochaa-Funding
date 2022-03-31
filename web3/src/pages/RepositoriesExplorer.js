import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import "../css/RepositoriesExplorer.css";
import { getContest, loadTasks } from "../model/Calls/Database";
import ReactMarkdown from "react-markdown";
import { backButton } from "../utils/utils";

function RepositoriesExplorer(props) {
	const [username, setUsername] = useState("");
	const params = useParams();
	const [taskList, setTaskList] = useState([]);
	const [contest, setContest] = useState({});
	const [description, setDescription] = useState();
	const [readMore, setReadMore] = useState(false);
	const linkName = readMore ? "Read Less << " : "Read More >> ";
	useEffect(() => {
		FetchContest(params.contest, setContest, setDescription);
	}, []);

	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
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
function LoadTasks({ params, taskList, setTaskList }) {
	useEffect(() => {
		var newTaskList = [];
		loadTasks(params.contest).then((tasks) => {
			for (const [key, value] of Object.entries(tasks)) {
				newTaskList.push(Task(tasks[key], key, params.contest));
			}
			setTaskList(newTaskList);
		});
	}, []);

	return taskList;
}

function Task(task, key, contestid) {
	return (
		<a
			className="contest-button"
			key={key}
			href={"/contest/" + contestid + "/" + key + "/"}>
			<div className="repo-task">{task["name"]}</div>
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
