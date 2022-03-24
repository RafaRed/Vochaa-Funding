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

var formatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",

	// These options are needed to round to whole numbers if that's what you want.
	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

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
			<p> <b>Value Math</b></p>
			<p>{formatter.format((props.votes.funding / props.votes.totalVotes) * props.votes.votes)}</p>
		</div>
	</div>;
}
