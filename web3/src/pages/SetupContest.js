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
} from "../model/Calls/Database";
import moment from "moment";

function SetupContest() {
	const [username, setUsername] = useState("");
	const [array, setArray] = useState();
	const fileInput = useRef(null);
	const selectFile = () => {
		fileInput.current.click();
	};
	const [contest, setContest] = useState({});
	const [pullrequests, setPullrequests] = useState([]);
	const params = useParams();
	useEffect(() => {
		FetchPullRequests(params.contest, setPullrequests);
		FetchContest(params.contest, setContest);
	}, []);

	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="setup-contest">
				<div className="wrapper">
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
										funding pool{" "}
										<span className="green">{formatter.format(contest.funding)}</span>
									</p>
								</div>
							</div>
							<button className="edit">EDIT</button>
						</div>
						<div className="content conteiner">{contest.description}</div>
					</div>

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
									onClick={() => updatePullRequests(params.contest, pullrequests)}>
									SAVE
								</button>
							</div>
						</div>
						<div className="divider"></div>
						<PullRequests pullrequests={pullrequests} setPullrequests={setPullrequests}></PullRequests>
					</div>
				</div>
			</div>
		</>
	);
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

function PullRequests(pullrequests,setPullrequests) {
	const pulls = [];
	if (pullrequests !== undefined && pullrequests.pullrequests !== undefined) {
		for (var i = 0; i < pullrequests.pullrequests.length; i++) {
			pulls.push(
				<PullRequestLayout
					key={i}
					pullrequest={pullrequests.pullrequests[i]}
					i={i}
					setPullrequests={()=>setPullrequests}
					pullrequests={pullrequests}></PullRequestLayout>
			);
		}
	}
	//console.log(pulls);
	return pulls;
}

function Func3(e,i,setPullrequests,pullrequests){
	const temp_state = [...pullrequests.pullrequests];
	temp_state[i].enabled = !temp_state[i].enabled
	setPullrequests(temp_state)
  }

function PullRequestLayout({ pullrequest, i, setPullrequests, pullrequests }) {

	return (
		<div className="pr-line">
			<input
				className="pr-checkbox"
				type="checkbox"
				id={pullrequest.user+pullrequest.pr}
				name="checkbox-pull"
				defaultChecked={pullrequest.enabled}
				onChange={(e)=>Func3(e,i,setPullrequests,pullrequests)}></input>
			<div className="pr">
				<div className="pr-header" onClick={() => toggleClass(i)}>
					<p className="pr-id">#{pullrequest.pr}</p>
					<p className="pr-title">{pullrequest.title}</p>
					<p className="pr-author"> - {pullrequest.user}</p>
				</div>
				<div id={"id-" + i} className={["pr-content", "hidden"].join(" ")}>
					<p className="pr-body">
						<ReactMarkdown>{pullrequest.body}</ReactMarkdown>
					</p>
					<a className="pr-url" href={pullrequest.url}>
						{pullrequest.url}
					</a>
					<p className="pr-repository">
						<b>Repo: </b>
						{pullrequest.repository}
					</p>
					<p className="pr-created">
						<b>Openned at: </b>
						{pullrequest.created}
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
