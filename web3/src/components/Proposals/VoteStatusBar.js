import React from "react";
import { numericValidator } from "../../utils/utils";

var formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });



export function VoteStatusBar(props) {

	var votes = numericValidator(props.votes.votes);
	var totalVotes = numericValidator(props.votes.totalVotes);
	var percentage = numericValidator((votes / totalVotes) * 100);
	var reward = numericValidator((props.votes.funding / props.votes.totalVotes) * votes)

	console.log(votes,totalVotes,percentage)


	return <div className="vote-status" key={0}>
		<div className="vote-status-header">
			<p>{votes} votes </p>
			<p>{Math.round(percentage)}%</p>
		</div>

		<div className="progress-bar">
			<div
				className="progress-bar-status"
				style={{ width: percentage + "%" }}></div>
		</div>

		<div className="vote-status-match">
			<p> <b>Reward</b></p>
			<p>{formatter.format(reward).replace("€",props.votes.currency)}</p>
		</div>
	</div>;
}
