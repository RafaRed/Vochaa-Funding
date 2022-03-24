import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import moment from "moment";
import "../css/Proposal.css";
import { ConfirmVoteButton } from "../components/Proposals/ConfirmVoteButton";
import { VoteOptions } from "../components/Proposals/VoteOptions";
import { VoteStatusBar } from "../components/Proposals/VoteStatusBar";
import { LoadVotes } from "../components/Proposals/LoadVotes";
import { getPullrequest, getVotes } from "../model/Calls/Database";
import ReactMarkdown from "react-markdown";

function Proposal(props) {
	const [project, setProject] = useState({ name: "#1 - Pull Request Title", symbol: "", address: "" });
	const [credits, setCredits] = useState(0);
	const [currentCredits, setCurrentCredits] = useState(0);
	const [vote, setVote] = useState([]);
	const [votes, setVotes] = useState(0)
	const [currentVotes, setCurrentVotes] = useState([]);
	const [proposal, setProposal] = useState({
		name: "",
		description: "",
		credits: "0",
	});
	const [task,setTask] = useState({});
	const [username, setUsername] = useState("");
	const params = useParams();
	useEffect(()=>{
		fetchTask(params,setTask)
		fetchVotes(params,setVotes)
	},[])

	/*LoadVotes(
		params,
		setProject,
		setProposal,
		setCredits,
		setCurrentCredits,
		setCurrentVotes,
		proposal,
		vote,
		setVote
	);*/


	var now = moment().unix();
	var status = getStatus(now, proposal);

	return (
		<div>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="proposal">
				<div className="wrapper">
					<div className="header">
						<div className="line">
							{/*<div className="image-block">
								<img src={task.logo} />
							</div>*/}

							<div className="info">
								<p className="name">#{task.pr} - {task.title}</p>
							</div>
						</div>
					</div>
					<div className="block">
						{/*<p className="name">{task.title}</p>*/}
						<ReactMarkdown className="description">{task.body}</ReactMarkdown>
					</div>
					<div className="block vote-block">
						<div className="vote-header">
							<p className="vote-title">VOTE</p>
							<div className="credits">
								<p className="credits-label">CREDITS</p>
								<p className="credits-value">{currentCredits}</p>
							</div>
						</div>
						<hr className="solid"></hr>

						<VoteOptions
							options={proposal.options}
							button={props.classes.setButton}
							setVote={setVote}
							vote={vote}
							credits={credits}
							setCurrentCredits={setCurrentCredits}
						/>

						<ConfirmVoteButton
							props={props}
							credits={credits}
							currentCredits={currentCredits}
							vote={vote}
							proposal={proposal}
							username={username}
							params={params}
							status={status}></ConfirmVoteButton>
					</div>
				</div>
				<div className="info-block">
					<div className="info-header">
						<p className="title">Information</p>
						<hr className="solid-80"></hr>
					</div>
					<div className="line">
						<p>Created by</p>
						<a className="author" href={"https://github.com/"+task.user}>{task.user}</a>
					</div>
					<div className="line">
						<p>Creation Date</p>
						<p>{task.created}</p>
					</div>
					<div className="line">
						<a className="author" href={task.url}>View on Github</a>
					</div>
					{/*<div className="line">
						<p>Start Date</p>
						<p>{moment.unix(proposal.startDate).format("DD MMM YYYY hh:mm a")}</p>
					</div>
					<div className="line">
						<p>End Date</p>
						<p>{moment.unix(proposal.endDate).format("DD MMM YYYY hh:mm a")}</p>
					</div>*/}
					<div className="info-header-2">
						<p className="title">Current Results</p>
						<hr className="solid-80"></hr>
					</div>
					<VoteStatusBar
						options={proposal.options}
						button={props.classes.setButton}
						currentVotes={currentVotes}
					/>
				</div>
			</div>
		</div>
	);
}
function fetchTask(params, setTask){
	getPullrequest(params.contest,params.task,params.proposal)
	.then(data => setTask(data))
}

function fetchVotes(params, setVotes){
	getVotes(params.contest,params.task,params.proposal)
	.then(data => setVotes(data))
}
function getStatus(now, proposal) {
	// 0 = waiting | 1 = running | 2 = ended
	return now > proposal.startDate ? (now < proposal.endDate ? 1 : 2) : 0;
}

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

export default injectSheet(styles)(Proposal);
