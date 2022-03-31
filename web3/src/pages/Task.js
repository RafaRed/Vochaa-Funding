import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { useParams } from "react-router-dom";

import { getAllPullrequestsVotes, getTask } from "../model/Calls/Database";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import seedrandom from "seedrandom";
import "../css/Task.css";

var formatter = new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency: "EUR",
});

function Task() {
	const [username, setUsername] = useState("");
	const params = useParams();

	const [search, setSearch] = useState();
	const [votesList, setVotesList] = useState({});
	const [tasks, setTasks] = useState({
		name: "Task Name",
		description: "Task description",
		"contest-startDate": 0,
		"contest-endDate": 0,
	});
	useEffect(() => {
		loadVotes(params.contest, params.task, setVotesList);
		loadTask(params, setTasks);
	}, []);
	var seed = 741852963;

	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="task">
				<div className="wrapper">
					<div className="task-info">
						<div className="block-info">
							<div className="block-wrapper">
								<div className="logo">
									<img className="contest-logo" src={tasks["contest-logourl"]}></img>
								</div>
								<div className="task-data">
									<h2>{tasks.name}</h2>
									<p className="task-date">
										From {moment.unix(tasks["contest-startDate"]).format("MM/DD/YYYY")} to{" "}
										{moment.unix(tasks["contest-endDate"]).format("MM/DD/YYYY")}
									</p>
									<a className="task-url" href={tasks["url"]}>
										<p>{tasks["url"]}</p>
									</a>
								</div>
							</div>
							<p className="task-description">{tasks.description}</p>
						</div>
						<div className="block-contest">
							<img className="contest-logo" src={tasks["contest-logourl"]}></img>
							<h2 className="contest-name">{tasks["contest-name"]}</h2>
							<p className="contest-pool">Funding Pool</p>
							<h2 className="contest-pool-value">
								{formatter
									.format(tasks["contest-funding"])
									.replace("€", tasks["contest-currency"])}
							</h2>
						</div>
					</div>
					<div className="search-bar">
						<input
							type="text"
							id="fname"
							name="fname"
							className="block-input"
							onChange={(val) => setSearch(val.target.value)}
						/>
						<img src="/images/search.png" />
					</div>
					<div className="board">
						<FetchPullRequests
							params={params}
							tasks={tasks}
							search={search}
							seed={seed}
							votesList={votesList}></FetchPullRequests>
					</div>
				</div>
			</div>
		</>
	);
}

function loadTask(params, setTasks) {
	getTask(params.contest, params.task).then((data) => setTasks(data));
}

function FetchPullRequests({ params, tasks, search, seed, votesList }) {
	var taskList = [];
	var rng = seedrandom(seed);

	if (tasks !== undefined && tasks.pullrequests !== undefined) {
		for (var i = 0; i < tasks.pullrequests.length; i++) {
			if (isOnSearch(tasks.pullrequests[i], search)) {
				var votes;
				var totalVotes = votesList["totalVotes"];
				var funding = votesList["funding"];
				if (votesList !== undefined && votesList.votes !== undefined) {
					votes = votesList.votes[tasks.pullrequests[i]["pr"]];
				}
				if (votes === undefined) {
					votes = 0;
				}
				//console.log("data:"+votes,totalVotes,funding)
				var percentage = 0;
				var valueMatch = formatter
					.format(0)
					.replace("€", tasks["contest-currency"]);
				if (votes !== 0) {
					percentage = Math.round((votes / totalVotes) * 100);
					valueMatch = formatter
						.format((funding / totalVotes) * votes)
						.replace("€", tasks["contest-currency"]);
				}

				//console.log("result:"+votes,percentage,valueMatch,tasks.pullrequests[i]['pr'])
				taskList.push(
					PullRequest(params, tasks.pullrequests[i], votes, percentage, valueMatch)
				);
			}
		}
	}
	taskList = taskList.sort(() => rng() - 0.5);
	return taskList;
}

function isOnSearch(task, search) {
	if (
		search === undefined ||
		search === "" ||
		searchCointains(task.title, search) ||
		searchCointains(task.pr, search) ||
		searchCointains("#" + task.pr, search) ||
		searchCointains(task.user, search)
	) {
		return true;
	} else {
		return false;
	}
}

function searchCointains(string, search) {
	return string.toLowerCase().startsWith(search.toLowerCase());
}
function PullRequest(params, task, votes, percentage, valueMatch) {
	return (
		<div className="pr" key={task.pr}>
			<p className="pr-id">#{task.pr}</p>
			<p className="pr-name">{task.title}</p>
			<div className="pr-info">
				<p>by</p>{" "}
				<a className="pr-author" href={"https://github.com/" + task.user}>
					{task.user}
				</a>{" "}
				<p>at</p>
				<p className="pr-date">{task.created}</p>
			</div>

			<div className="divider"></div>

			<div className="vote-status" key={0}>
			<div className="vote-status-match">
					<p>
						<b>Reward</b>
					</p>
					<p>{valueMatch}</p>
				</div>
				
				<div className="vote-status-header">
					<p>{votes} votes </p>
					<p>{Math.round(percentage)}%</p>
				</div>

				<div className="progress-bar">
					<div
						className="progress-bar-status"
						style={{ width: percentage + "%" }}></div>
				</div>

				
			</div>
			<a
				className="view-button-wrapper"
				href={"/contest/" + params.contest + "/" + params.task + "/" + task.pr}>
				<p className="view-button">View More</p>
			</a>


		</div>
	);
}

function loadVotes(contestid, repositoryid, setVotesList) {
	getAllPullrequestsVotes(contestid, repositoryid).then((data) =>
		setVotesList(data)
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

export default injectSheet(styles)(Task);
