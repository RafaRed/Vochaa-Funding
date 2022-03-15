import React from "react";
import { reduceVote, addVote } from "./CreditsController";


export function VoteButton(props) {
	//console.log(props)
	return (
		<div className="vote-button">
			<div
				onClick={() => reduceVote(props)}
				className={[props.button, "less"].join(" ")}>
				-
			</div>
			<div className="quantity">
				{props.vote !== undefined && props.vote.length > 0
					? props.vote[props.index]
					: 0}
			</div>
			<div
				onClick={() => addVote(props)}
				className={[props.button, "more"].join(" ")}>
				+
			</div>
		</div>
	);
}
