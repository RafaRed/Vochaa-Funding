import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../css/SetupContest.css";
import injectSheet from "react-jss";
import Papa from "papaparse";
import ReactMarkdown from "react-markdown";
import { updatePullRequests, getPullRequests } from "../model/Calls/Database";

function SetupContest() {
	const [username, setUsername] = useState("");
	const [array, setArray] = useState();
	const fileInput = useRef(null);
	const selectFile = () => {
		fileInput.current.click();
	};
	const [pullrequests, setPullrequests] = useState([]);
	const params = useParams();
	useEffect(()=>{
		FetchPullRequests(params.contest,setPullrequests)
	},[])
	

	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="setup-contest">
				<div className="wrapper">
					<div className="block">
						<div className="header">
							<div className="data">
								<div className="logo">
									<img src="" />
								</div>
								<div className="labels">
									<h2 className="block-title">Contest Name</h2>
									<p>from 03/14/2022 to 03/30/2022</p>
									<p>100 credits per user</p>
									<p>
										funding pool <span className="green">$80.000</span>
									</p>
								</div>
							</div>
							<button className="edit">EDIT</button>
						</div>
						<div className="content conteiner">
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text ever
							since the 1500s, when an unknown printer took a galley of type and
							scrambled it to make a type specimen book. It has survived not only five
							centuries, but also the leap into electronic typesetting, remaining
							essentially unchanged. Lorem Ipsum is simply dummy text of the printing
							and typesetting industry. Lorem Ipsum has been the industry's standard
							dummy text ever since the 1500s, when an unknown printer took a galley of
							type and scrambled it to make a type specimen book. It has
						</div>
					</div>

					<div className="block">
						<div className="pull-header">
							<h2 className="block-title">Pull Requests</h2>
							<div className="buttons">
								<input
									ref={fileInput}
									onChange={(e) => upload(e, setArray, array, params, setPullrequests, pullrequests)}
									type="file"
									style={{ display: "none" }}
								/>
								<button onClick={selectFile} className="import">
									IMPORT CSV
								</button>
								<button className="save" onClick={()=>updatePullRequests(params.contest,pullrequests)}>SAVE</button>
							</div>
						</div>
						<div className="divider"></div>
						<PullRequests pullrequests={pullrequests}></PullRequests>
					</div>
				</div>
			</div>
		</>
	);
}

function FetchPullRequests(contestid,setPullrequests){
	getPullRequests(contestid)
	.then(data => setPullrequests(data))
}

function upload(e, setArray, array, params, setPullrequests, pullrequests) {
	const file = e.target.files[0];
	const fileReader = new FileReader();
	if (file) {
		fileReader.onload = function (event) {
			const csvOutput = event.target.result;
			loadCsv(csvOutput, setArray, array, params, setPullrequests,pullrequests);
		};

		fileReader.readAsText(file);
	}
}

function loadCsv(string, setArray, array, params, setPullrequests,pullrequests) {
	var newarray = Papa.parse(string, { header: true }).data
	setArray(newarray);

	var newPullRequests = []
	if (newarray !== undefined) {
		var prs = newarray;
		for (var i = 0; i < prs.length; i++) {
			if(prs[i]["#"] !== undefined){
				var newData = {
					pr: prs[i]["#"],
					title: prs[i].Title,
					user: prs[i].User,
					body: prs[i].Body,
					url: prs[i].URL,
					repository: prs[i].Repository,
					contestid: params.contest,
					created: prs[i].Created,
					enabled: false
				};
				newPullRequests.push(newData)
			}
		}
		//setPullrequests(pullrequests => ([...pullrequests, ...newPullRequests])) APPEND ARRAYS
		mergeArrays(pullrequests,newPullRequests,setPullrequests)
	}
}

function mergeArrays(pullrequests,newPullRequests,setPullrequests){
	var newArray = newPullRequests;
	for(var i = 0; i < pullrequests.length; i++){
		var hasValue = false;
		for( var j = 0; j < newArray.length; j++){
			
			//console.log(pullrequests[i].pr === newArray[j].pr)
			if(pullrequests[i].pr === newArray[j].pr && pullrequests[i].repository === newArray[j].repository) // Check if not contains this value, if so keep the newer.
			{
				//console.log(pullrequests[i].pr)
				hasValue = true;
				newArray[j]['updated'] = true;
			}
		}
		console.log(hasValue)
		if(hasValue === false){
			newArray.push(pullrequests[i])
		}
	}
	setPullrequests(newArray)
}


function PullRequests(pullrequests) {
	const pulls = [];
	if (pullrequests !== undefined && pullrequests.pullrequests !== undefined) {
		for (var i = 0; i < pullrequests.pullrequests.length; i++) {
			pulls.push(
				<PullRequestLayout key={i} pullrequest={pullrequests.pullrequests[i]} i={i}></PullRequestLayout>
			);
		}
	}
	//console.log(pulls);
	return pulls;
}

function PullRequestLayout({ pullrequest, i }) {
	//console.log(pullrequest)
	return (
		<div className="pr-line">
			<input
				className="pr-checkbox"
				type="checkbox"
				id="pull"
				name="checkbox-pull"></input>
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
