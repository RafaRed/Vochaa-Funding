import React from "react";
import moment from "moment";
import { SendVotes } from "./sendVotes";

export function ConfirmVoteButton(props) {
	//console.log(props)
	return (
		<button
			onClick={props.status == 1
				? props.currentCredits !== props.credits
					? () => SendVotes(
						props.contestid, props.repositoryid, props.pullrequestid, props.vote, props.username
					)
					: () => { }
				: () => { }}
			className={GetStatusStyle(
				props.currentCredits,
				props.credits,
				props.status,
				props.props
			)}>
			{GetStatusText(props.status, props.startDate, props.endDate)}
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
function GetStatusText(status, startDate, endDate) {
	//console.log(startDate,endDate)
	return status == 0
		? "STARTS ON - " +
		moment.unix(startDate).format("DD MMM YYYY hh:mm a").toUpperCase()
		: status == 1
			? "SEND VOTE"
			: "ENDED ON - " +
			moment.unix(endDate).format("DD MMM YYYY hh:mm a").toUpperCase();
}
