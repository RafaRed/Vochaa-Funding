import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

export function LoadVotes(params, setProject, setProposal, setCredits, setCurrentCredits, setCurrentVotes, proposal, vote, setVote) {
	useEffect(() => {
		const db = GetProject(params, setProject);
		GetProposal(db, params, setProposal, setCredits, setCurrentCredits);
		GetProposalVotes(db, params, setCurrentVotes);
	}, []);

	SetVotes(proposal, vote, setVote);
}

function SetVotes(proposal, vote, setVote) {
	if (proposal.options !== undefined && vote.length <= 1) {
		var voteList = [];
		for (var i = 0; i < proposal.options.length; i++) {
			voteList.push(0);
		}
		setVote(voteList);
	}
}

function GetProposalVotes(db, params, setCurrentVotes) {
	const voteRef = ref(
		db,
		"proposals/" + params.project + "/" + params.proposal + "/votes"
	);
	onValue(voteRef, (snapshot) => {
		var _votes = [];
		const data = snapshot.val();
		for (let v in data) {
			_votes.push(data[v]);
		}
		setCurrentVotes(_votes);
	});
}

function GetProposal(db, params, setProposal, setCredits, setCurrentCredits) {
	const proposalRef = ref(
		db,
		"proposals/" + params.project + "/" + params.proposal
	);
	onValue(proposalRef, (snapshot) => {
		const data = snapshot.val();
		setProposal(data);
		setCredits(data.credits);
		setCurrentCredits(data.credits);
	});
}

function GetProject(params, setProject) {
	const db = getDatabase();
	const starCountRef = ref(db, "projects/" + params.project);
	onValue(starCountRef, (snapshot) => {
		const data = snapshot.val();
		setProject(data);
	});
	return db;
}