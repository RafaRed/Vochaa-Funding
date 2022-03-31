import React from "react";
/*
export function VoteStatusBar(props) {
	var options = [];
	var totalVotes = 0;

	for (var i = 0; i < props.currentVotes.length; i++) {
		totalVotes += Math.abs(props.currentVotes[i]);
	}
	//console.log(totalVotes)
	if (props.options !== undefined) {
		for (var i = 0; i < props.options.length; i++) {
			var percentage = (props.currentVotes[i] / totalVotes) * 100;

			if (percentage == undefined || isNaN(percentage)) {
				percentage = 0;
			}
			options.push(
				<div className="vote-status" key={props.options[i]}>
					<div className="vote-status-header">
						<p>{props.options[i]} </p>
						<p>{Math.round(percentage)}%</p>
					</div>

					<div className="progress-bar">
						<div
							className="progress-bar-status"
							style={{ width: percentage + "%" }}></div>
					</div>
				</div>
			);
		}

		return options;
	} else {
		return <></>;
	}
}*/

var formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

export function VoteStatusBar(props) {
	console.log(props)
	var percentage = (props.votes.votes / props.votes.totalVotes) * 100;

	return <div className="vote-status" key={0}>
		<div className="vote-status-header">
			<p>{props.votes.votes} votes </p>
			<p>{Math.round(percentage)}%</p>
		</div>

		<div className="progress-bar">
			<div
				className="progress-bar-status"
				style={{ width: percentage + "%" }}></div>
		</div>

		<div className="vote-status-match">
			<p> <b>Reward</b></p>
			<p>{formatter.format((props.votes.funding / props.votes.totalVotes) * props.votes.votes).replace("€",props.votes.currency)}</p>
		</div>
	</div>;
}
