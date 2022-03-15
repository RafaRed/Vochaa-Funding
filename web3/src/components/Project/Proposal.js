import React from "react";
import moment from "moment";

export function Proposal(props) {
	return (
		<a href={"/project/" + props.address + "/" + props.pkey}>
			<div className="proposal">
				<div className="line">
					<p className="name">{props.proposal.name}</p>
					<StatusTag proposal={props.proposal} now={props.now} />
				</div>

				<p className="description">{props.proposal.description}</p>
				<DisplayWinnerOrStatus
					proposal={props.proposal}
					now={props.now}
					winner={props.winner}
				/>
			</div>
		</a>
	);
}
function StatusTag(props) {
	return (
		<p
			className={
				props.now > props.proposal.startDate
					? props.now < props.proposal.endDate
						? "status running"
						: "status ended"
					: "status waiting"
			}>
			{props.now > props.proposal.startDate
				? props.now < props.proposal.endDate
					? "Running"
					: "Ended"
				: "Waiting"}
		</p>
	);
}
function DisplayWinnerOrStatus(props) {
	return (
		<div className={props.winner !== "" ? "result-winner" : "result"}>
			{props.now > props.proposal.startDate ? (
				props.now < props.proposal.endDate ? (
					"This voting will end on " +
					moment.unix(props.proposal.endDate).format("DD MMM YYYY hh:mm a")
				) : (
					<div className="winner-line">
						<img className="winner-icon" src="/images/check.png" />
						{props.winner}
					</div>
				)
			) : (
				"This voting will start on " +
				moment.unix(props.proposal.endDate).format("DD MMM YYYY hh:mm a")
			)}
		</div>
	);
}
