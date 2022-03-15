import React from "react";
import moment from "moment";
import { Proposal } from "./Proposal";

export function RenderProposals(props) {
	var proposals = [];

	var now = moment().unix();

	if (Object.keys(props.proposals).length > 0) {
		for (const [key, value] of Object.entries(props.proposals)) {
			var winner = "";

			winner = getWinnerIfEnded(props, key, winner);
			proposals.push(
				<Proposal
					key={key}
					pkey={key}
					address={props.address}
					proposal={props.proposals[key]}
					now={now}
					winner={winner}></Proposal>
			);
			proposals.reverse();
		}
	}

	return <div>{proposals}</div>;
}

function getWinnerIfEnded(props, key, winner) {
	var max = 0;
	var max_id = 0;
	if (moment().unix() > props.proposals[key].endDate) {
		for (var i = 0; i < props.proposals[key].votes.length; i++) {
			if (props.proposals[key].votes[i] > max) {
				max = props.proposals[key].votes[i];
				max_id = i;
			}
		}
		winner = props.proposals[key].options[max_id];
	}
	return winner;
}
