import React from "react";
import moment from "moment";
import { SendVotes } from "./sendVotes";

export function ConfirmVoteButton(props) {
	return (
		<button
			onClick={props.status == 1
				? props.currentCredits !== props.credits
					? () => SendVotes(
						props.vote,
						props.params.project,
						props.params.proposal,
						props.wallet
					)
					: () => { }
				: () => { }}
			className={GetStatusStyle(
				props.currentCredits,
				props.credits,
				props.status,
				props.props
			)}>
			{GetStatusText(props.status, props.proposal)}
		</button>
	);
}
function GetStatusStyle(currentCredits, credits, status, props) {
	return [
		currentCredits !== credits && status == 1 ? props.classes.button : "",
		currentCredits !== credits && status == 1
			? "send-vote"
			: "send-vote-disabled",
	].join(" ");
}
function GetStatusText(status, proposal) {
	return status == 0
		? "STARTS ON - " +
		moment.unix(proposal.startDate).format("DD MMM YYYY hh:mm a").toUpperCase()
		: status == 1
			? "SEND VOTE"
			: "ENDED ON - " +
			moment.unix(proposal.endDate).format("DD MMM YYYY hh:mm a").toUpperCase();
}
