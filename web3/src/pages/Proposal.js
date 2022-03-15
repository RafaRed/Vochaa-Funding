import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import moment from "moment";
import "../css/Proposal.css";
import { ConfirmVoteButton } from "../components/Proposals/ConfirmVoteButton";
import { VoteOptions } from "../components/Proposals/VoteOptions";
import { VoteStatusBar } from "../components/Proposals/VoteStatusBar";
import { LoadVotes } from "../components/Proposals/LoadVotes";

function Proposal(props) {
	const [project, setProject] = useState({ name: "", symbol: "", address: "" });
	const [credits, setCredits] = useState(0);
	const [currentCredits, setCurrentCredits] = useState(0);
	const [vote, setVote] = useState([]);
	const [currentVotes, setCurrentVotes] = useState([]);
	const [proposal, setProposal] = useState({
		name: "",
		description: "",
		credits: "0",
	});
	const [wallet, setWallet] = useState();

	const params = useParams();

	LoadVotes(
		params,
		setProject,
		setProposal,
		setCredits,
		setCurrentCredits,
		setCurrentVotes,
		proposal,
		vote,
		setVote
	);
	var now = moment().unix();
	var status = getStatus(now, proposal);

	return (
		<div>
			<Navbar menu="explore" setWallet={setWallet} />
			<div className="proposal">
				<div className="wrapper">
					<div className="header">
						<div className="line">
							<div className="image-block">
								<img src={project.logo} />
							</div>

							<div className="info">
								<p className="name">{project.name}</p>
								<p className="address">{project.address}</p>
							</div>
						</div>
					</div>
					<div className="block">
						<p className="name">{proposal.name}</p>
						<p className="description">{proposal.description}</p>
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
							wallet={wallet}
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
						<p className="sender">{proposal.sender}</p>
					</div>
					<div className="line">
						<p>Start Date</p>
						<p>{moment.unix(proposal.startDate).format("DD MMM YYYY hh:mm a")}</p>
					</div>
					<div className="line">
						<p>End Date</p>
						<p>{moment.unix(proposal.endDate).format("DD MMM YYYY hh:mm a")}</p>
					</div>
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
