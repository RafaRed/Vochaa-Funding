import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { useParams } from "react-router-dom";

import { getAllPullrequestsVotes, getTask } from "../model/Calls/Database";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import seedrandom from "seedrandom";
import "../css/Task.css";
import { backButton } from "../utils/utils";

var formatter = new Intl.NumberFormat("de-DE", {
	style: "currency",
	currency: "EUR",
});

function Task(props) {
	const [username, setUsername] = useState("");
	const params = useParams();
	const [listview, setListView] = useState(true);
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
					<div
						onClick={() => backButton("../tasks")}
						className={["back-button", props.classes.button].join(" ")}>
						<img src="/images/back.png"></img>
						<p>BACK</p>
					</div>
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
					<div className="searchbar-toggle">
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
						<div className="toggle-button">
								<div onClick={()=>setListView(false)} className={["tableview",listview?"not-toggled":"toggled"].join(' ')}>
									<img src="/images/grid.png"></img>
								</div>
								<div onClick={()=>setListView(true)} className={["listview",listview?"toggled":"not-toggled"].join(' ')}>
								<img src="/images/list.png"></img>
								</div>
						</div>
					</div>

					<div className={listview ? "listboard" : "tableboard"}>
						<FetchPullRequests
							params={params}
							tasks={tasks}
							search={search}
							seed={seed}
							votesList={votesList}
							listview={listview}></FetchPullRequests>
					</div>
				</div>
			</div>
		</>
	);
}

function loadTask(params, setTasks) {
	getTask(params.contest, params.task).then((data) => setTasks(data));
}

function FetchPullRequests({
	params,
	tasks,
	search,
	seed,
	votesList,
	listview,
}) {
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
				if (listview) {
					taskList.push(
						PullRequestList(
							params,
							tasks.pullrequests[i],
							votes,
							percentage,
							valueMatch
						)
					);
				} else {
					taskList.push(
						PullRequestTable(
							params,
							tasks.pullrequests[i],
							votes,
							percentage,
							valueMatch
						)
					);
				}
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
function PullRequestTable(params, task, votes, percentage, valueMatch) {
	return (
		<div className="pr" key={task.pr}>
			<p className="pr-id">#{task.pr}</p>
			<p className="pr-name">{task.title}</p>
			<div className="pr-info">
				<p>by</p>
				<a className="pr-author" href={"https://github.com/" + task.user}>
					{task.user}
				</a>
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

function PullRequestList(params, task, votes, percentage, valueMatch) {
	return (
		<div className="list-pr" key={task.pr}>
			<div className="list-pr-info">
				<p className="list-pr-id">#{task.pr}</p>
				<p className="nowrap">
					by{" "}
					<a className="list-pr-author" href={"https://github.com/" + task.user}>
						{task.user}
					</a>
				</p>

				<p className="nowrap">{task.created}</p>
			</div>
			<p className="list-pr-name">{task.title}</p>
			<div className="vote-data">
				<div className="list-vote-status" key={0}>
					<div className="list-vote-info">
						<div className="list-vote-status-header">
							<p>{votes} votes </p>
							<p>{Math.round(percentage)}%</p>
						</div>

						<div className="list-progress-bar">
							<div
								className="list-progress-bar-status"
								style={{ width: percentage + "%" }}></div>
						</div>
					</div>
					<div className="list-vote-status-match">
						<p className="reward-text">
							<span>
								<b>Reward</b>
							</span>
						</p>
						<p className="reward-text">
							<span>{valueMatch}</span>
						</p>
					</div>
				</div>
				<a
					className="view-button-wrapper"
					href={"/contest/" + params.contest + "/" + params.task + "/" + task.pr}>
					<p className="list-view-button">View More & Vote</p>
				</a>
			</div>
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
