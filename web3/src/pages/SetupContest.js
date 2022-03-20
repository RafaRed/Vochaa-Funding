import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../css/SetupContest.css";
import injectSheet from "react-jss";
import Papa from "papaparse";
import ReactMarkdown from 'react-markdown'

function SetupContest() {
	const [username, setUsername] = useState("");
	const [array, setArray] = useState();
	const fileInput = useRef(null);
	const selectFile = () => {
		fileInput.current.click();
	};

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
									onChange={(e) => upload(e, setArray)}
									type="file"
									style={{ display: "none" }}
								/>
								<button onClick={selectFile} className="import">
									IMPORT CSV
								</button>
								<button className="save">SAVE</button>
							</div>
						</div>
						<div className="divider"></div>
						<PullRequests array={array}></PullRequests>
					</div>
				</div>
			</div>
		</>
	);
}

function upload(e, setArray) {
	const file = e.target.files[0];
	const fileReader = new FileReader();
	if (file) {
		fileReader.onload = function (event) {
			const csvOutput = event.target.result;
			loadCsv(csvOutput, setArray);
		};

		fileReader.readAsText(file);
	}
}

function loadCsv(string, setArray) {
	setArray(Papa.parse(string, { header: true }).data);
}

function PullRequests(array) {
	const pulls = [];
	console.log(array);
	if (array !== undefined && array.array != undefined) {
		for (var i = 0; i < array.array.length; i++) {
			pulls.push(<PullRequestLayout key={i} array={array.array} i={i}></PullRequestLayout>);
		}
	}
	console.log(pulls);
	return pulls;
}

function PullRequestLayout({array,i}) {
	
	return(<div className="pr">
		<div className="pr-checkbox"></div>
		<div className="pr-header" onClick={()=>toggleClass(i)}>
			<p className="pr-id">#{array[i]["#"]}</p>
			<p className="pr-title">{array[i].Title}</p>
			<p className="pr-author"> - {array[i].User}</p>
		</div>
		<div id={"id-"+i} className={["pr-content","hidden"].join(' ')}>
			<p className="pr-body"><ReactMarkdown>{array[i].Body}</ReactMarkdown></p>
			<a className="pr-url" href={array[i].URL}>{array[i].URL}</a>
			<p className="pr-repository">
				<b>Repo: </b>
				{array[i].Repository}
			</p>
			<p className="pr-created">
				<b>Openned at: </b>
				{array[i].Created}
			</p>
		</div>
	</div>)
}

function toggleClass(i) {
    const oldClassName = document.getElementById('id-'+i).className;
    const newClassName = oldClassName === 'pr-content hidden' ? 'pr-content visible' : 'pr-content hidden'
    document.getElementById('id-'+i).className = newClassName
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
