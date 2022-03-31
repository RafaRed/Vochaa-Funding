import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/SetupContest.css";
import injectSheet from "react-jss";
import Papa from "papaparse";
import ReactMarkdown from "react-markdown";
import {
	updatePullRequests,
	getPullRequests,
	getContest,
	getExportData,
	getUpdateContest,
} from "../model/Calls/Database";
import { CSVLink } from "react-csv";
import moment from "moment";
import { numericValidator } from "../utils/utils";

function SetupContest() {
	const [username, setUsername] = useState("");
	const [array, setArray] = useState();
	const [edit, setEdit] = useState(false);
	const fileInput = useRef(null);
	const selectFile = () => {
		fileInput.current.click();
	};
	const [contest, setContest] = useState({});
	const [pullrequests, setPullrequests] = useState([]);
	const params = useParams();
	const csvLink = useRef();
	const [csvData, setCsvData] = useState([]);

	useEffect(() => {
		FetchContest(params.contest, setContest);
	}, []);
	useEffect(() => {
		console.log("call");
		FetchPullRequests(params.contest, setPullrequests);
	}, []);

	const setCheckboxState = (id) => {
		console.log("call funct");
		const temp_state = [...pullrequests];
		temp_state[id].enabled = !temp_state[id].enabled;
		setPullrequests(temp_state);
	};

	var formatter = new Intl.NumberFormat("de-DE", {
		style: "currency",
		currency: "EUR",
	});

	const handleOnChangeContestData = (e, functionValue, setFunction, prop) => {
		var currentValues = functionValue;
		currentValues[prop] = e.target.value;
		setFunction(currentValues);
	};

	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="setup-contest">
				<div className="wrapper">
					{edit
						? EdditableData(
								contest,
								formatter,
								setEdit,
								edit,
								params,
								handleOnChangeContestData,
								setContest,csvLink,setCsvData
						  )
						: StaticData(contest, formatter, setEdit, edit, params,csvLink,setCsvData)}

					<div className="block">
						<div className="pull-header">
							<h2 className="block-title">Pull Requests</h2>
							<div className="buttons">
								<input
									ref={fileInput}
									onChange={(e) =>
										upload(e, setArray, array, params, setPullrequests, pullrequests)
									}
									type="file"
									style={{ display: "none" }}
								/>
								<button onClick={selectFile} className="import">
									IMPORT CSV
								</button>
								<button
									className="save"
									onClick={() =>
										updatePullRequests(params.contest, pullrequests).then((result) =>
											window.location.reload(false)
										)
									}>
									SAVE
								</button>
								<CSVLink
									data={csvData}
									filename={contest.name+".csv"}
									className="hidden"
									ref={csvLink}
									target="_blank"
								/>
							</div>
						</div>
						<div className="divider"></div>
						<div className="checkbox-controller">
							<input
								className="pr-checkbox"
								type="checkbox"
								id="checkall"
								name="checkbox-pull"
								defaultChecked={false}
								onChange={(e) => {
									CheckboxController(e, setPullrequests, pullrequests);
								}}></input>
							<p>Select All / Deselect All </p>
						</div>

						<PullRequests
							pullrequests={pullrequests}
							setCheckboxState={setCheckboxState}></PullRequests>
					</div>
				</div>
			</div>
		</>
	);
}
function StaticData(contest, formatter, setEdit, edit, params, csvLink, setCsvData) {
	return (
		<div className="block">
			<div className="header">
				<div className="data">
					<div>
						<img className="logo" src={contest.logourl} />
					</div>
					<div className="labels">
						<h2 className="block-title">{contest.name}</h2>
						<p>
							from {moment.unix(contest.startDate).format("MM/DD/YYYY")} to{" "}
							{moment.unix(contest.endDate).format("MM/DD/YYYY")}
						</p>
						<p>{contest.credits} credits per user</p>
						<p>
							<span className="green">
								{formatter.format(contest.funding).replace("€", contest.currency)}
							</span>
						</p>
					</div>
				</div>
				<div className="buttons">
					<button className="edit" onClick={() => setEdit(true)}>
						EDIT
					</button>
					<button className="edit" onClick={() => exportData(params.contest, csvLink,setCsvData)}>
						Export
					</button>
				</div>
			</div>
			<div className="content conteiner">
				<ReactMarkdown>{contest.description}</ReactMarkdown>
			</div>
		</div>
	);
}

function EdditableData(
	contest,
	formatter,
	setEdit,
	edit,
	params,
	handleOnChangeContestData,
	setContest,
	csvLink,
	setCsvData
) {
	return (
		<div className="block">
			<div className="header">
				<div className="data">
					<div>
						<img className="logo" src={contest.logourl} />
					</div>
					<div className="labels">
						<h2>
							<input
								type="text"
								onChange={(e) =>
									handleOnChangeContestData(e, contest, setContest, "name")
								}
								className="block-input"
								defaultValue={contest.name}
							/>
						</h2>

						<p>
							from {moment.unix(contest.startDate).format("MM/DD/YYYY")} to{" "}
							{moment.unix(contest.endDate).format("MM/DD/YYYY")}
						</p>
						<p>{contest.credits} credits per user</p>
						<p>
							<span className="green">
								{formatter.format(contest.funding).replace("€", contest.currency)}
							</span>
						</p>
					</div>
				</div>
				<div className="buttons">
					<button
						className="save"
						onClick={() =>
							updateContest(params.contest, contest.name, contest.description)
						}>
						SAVE
					</button>
					<button className="edit" onClick={() => exportData(params.contest, csvLink,setCsvData)}>
						Export
					</button>
				</div>
			</div>

			<textarea
				cols="40"
				rows="5"
				type="text"
				defaultValue={contest.description}
				onChange={(e) =>
					handleOnChangeContestData(e, contest, setContest, "description")
				}
				className={["block-area-input"].join(" ")}
			/>
		</div>
	);
}

function updateContest(contestid, contestName, contestDescription) {
	getUpdateContest(contestid, contestName, contestDescription).then(() =>
		window.location.reload(false)
	);
}

function clean(string){
	return string.replace(/,/g, '-').replace(";",".").replace(/"/g, '``');
}
function exportData(contestid, csvLink,setCsvData) {
	getExportData(contestid).then((contestData) => {
		var csvData = []
		var header = ["pr_id","pr_title","pr_body","pr_author","pr_repository","pr_url","pr_date","pr_enabled","pr_votes","pr_votes_perc","pr_funding_claimed"]
		csvData.push(header)
		for (const [repo_key, repo_value] of Object.entries(contestData.pullrequests)) {
			for (const [pullrequest_key, pullrequest_value] of Object.entries(contestData.pullrequests[repo_key])) {
				var pr = contestData.pullrequests[repo_key][pullrequest_key]
				var pr_votes = numericValidator(pr.votes);
				var contest_votes = numericValidator(contestData.contestVotes);
				var votesPerc = numericValidator((pr_votes / contest_votes) * 100);
				var fundingClaimed = numericValidator((contestData.contestFunding / contest_votes) * pr_votes);
				var prData = [pr.pr,clean(pr.title),clean(pr.body),pr.user,pr.repository,pr.url,pr.created,pr.enabled,pr_votes,votesPerc,fundingClaimed]
				csvData.push(prData)
			}
		}
		setCsvData(csvData)
		csvLink.current.link.click()
	});
}
function CheckboxController(e, setPullrequests, pullrequests) {
	var checked = e.target.checked;
	const temp_state = [...pullrequests];
	for (var i = 0; i < temp_state.length; i++) {
		temp_state[i].enabled = checked;
	}

	setPullrequests(temp_state);
}

function FetchContest(contestid, setContest) {
	getContest(contestid).then((data) => setContest(data));
}
function FetchPullRequests(contestid, setPullrequests) {
	getPullRequests(contestid).then((data) => setPullrequests(data));
}

function upload(e, setArray, array, params, setPullrequests, pullrequests) {
	const file = e.target.files[0];
	const fileReader = new FileReader();
	if (file) {
		fileReader.onload = function (event) {
			const csvOutput = event.target.result;
			loadCsv(csvOutput, setArray, array, params, setPullrequests, pullrequests);
		};

		fileReader.readAsText(file);
	}
}

function loadCsv(
	string,
	setArray,
	array,
	params,
	setPullrequests,
	pullrequests
) {
	var newarray = Papa.parse(string, { header: true }).data;
	setArray(newarray);

	var newPullRequests = [];
	if (newarray !== undefined) {
		var prs = newarray;
		for (var i = 0; i < prs.length; i++) {
			if (prs[i]["#"] !== undefined) {
				var newData = {
					pr: prs[i]["#"],
					title: prs[i].Title,
					user: prs[i].User,
					body: prs[i].Body,
					url: prs[i].URL,
					repository: prs[i].Repository,
					contestid: params.contest,
					created: prs[i].Created,
					enabled: false,
				};
				newPullRequests.push(newData);
			}
		}
		//setPullrequests(pullrequests => ([...pullrequests, ...newPullRequests])) APPEND ARRAYS
		mergeArrays(pullrequests, newPullRequests, setPullrequests);
	}
}

function mergeArrays(pullrequests, newPullRequests, setPullrequests) {
	var newArray = newPullRequests;
	for (var i = 0; i < pullrequests.length; i++) {
		var hasValue = false;
		for (var j = 0; j < newArray.length; j++) {
			//console.log(pullrequests[i].pr === newArray[j].pr)
			if (
				pullrequests[i].pr === newArray[j].pr &&
				pullrequests[i].repository === newArray[j].repository
			) {
				// Check if not contains this value, if so keep the newer.
				//console.log(pullrequests[i].pr)
				hasValue = true;
				newArray[j]["updated"] = true;
			}
		}
		console.log(hasValue);
		if (hasValue === false) {
			newArray.push(pullrequests[i]);
		}
	}
	setPullrequests(newArray);
}

function PullRequests({ pullrequests, setCheckboxState }) {
	const pulls = [];
	if (pullrequests !== undefined && pullrequests !== undefined) {
		for (var i = 0; i < pullrequests.length; i++) {
			pulls.push(
				<PullRequestLayout
					key={i}
					pullrequest={pullrequests[i]}
					i={i}
					setCheckboxState={setCheckboxState}
					pullrequests={pullrequests}></PullRequestLayout>
			);
		}
	}
	//console.log(pulls);
	return pulls;
}

function PullRequestLayout(props) {
	return (
		<div className="pr-line">
			<input
				className="pr-checkbox"
				type="checkbox"
				id={props.pullrequest.user + props.pullrequest.pr}
				name="checkbox-pull"
				checked={props.pullrequests[props.i].enabled}
				onChange={() => props.setCheckboxState(props.i)}></input>
			<div className="pr">
				<div className="pr-header" onClick={() => toggleClass(props.i)}>
					<p className="pr-id">#{props.pullrequest.pr}</p>
					<p className="pr-title">{props.pullrequest.title}</p>
					<p className="pr-author"> - {props.pullrequest.user}</p>
				</div>
				<div id={"id-" + props.i} className={["pr-content", "hidden"].join(" ")}>
					<p className="pr-body">
						<ReactMarkdown>{props.pullrequest.body}</ReactMarkdown>
					</p>
					<a className="pr-url" href={props.pullrequest.url}>
						{props.pullrequest.url}
					</a>
					<p className="pr-repository">
						<b>Repo: </b>
						{props.pullrequest.repository}
					</p>
					<p className="pr-created">
						<b>Openned at: </b>
						{props.pullrequest.created}
					</p>
				</div>
			</div>
		</div>
	);
}

function toggleClass(i) {
	const oldClassName = document.getElementById("id-" + i).className;
	const newClassName =
		oldClassName === "pr-content hidden"
			? "pr-content visible"
			: "pr-content hidden";
	document.getElementById("id-" + i).className = newClassName;
}

function showContent() {}

const styles = {
	button: {
		"&:hover": {
			backgroundColor: "#40a9ff",
		},
	},
	setButton: {
		"&:hover": {
			backgroundColor: "#cccccc",
		},
	},
};

export default injectSheet(styles)(SetupContest);
