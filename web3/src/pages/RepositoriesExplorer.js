import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import "../css/RepositoriesExplorer.css";
import { loadTasks } from "../model/Calls/Database";

function RepositoriesExplorer(props) {
	const [username, setUsername] = useState("");
	const params = useParams();
	const [taskList,setTaskList] = useState([]);
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
						<LoadTasks params={params} taskList={taskList} setTaskList={setTaskList}></LoadTasks>
					</div>
				</div>
			</div>
		</>
	);
}

function LoadTasks({ params, taskList, setTaskList}) {

		useEffect(()=>{
			var newTaskList = []
			loadTasks(params.contest).then((tasks) => {
				for (const [key, value] of Object.entries(tasks)) {
					newTaskList.push(Task(tasks[key],key));
				}
				setTaskList(newTaskList)
	
			});
		},[])
		


	
	return taskList;
}

function Task(task,key) {
	return (
		<a className="contest-button" key={key} href={"/contest/" + key + "/taskid" }>
			<div className="repo-task">{task['name']}</div>
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
