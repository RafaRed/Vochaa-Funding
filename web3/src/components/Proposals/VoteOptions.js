import React from "react";
import { VoteButton } from "./VoteButton";

export function VoteOptions(props) {
	var options = [];

	if (props.options !== undefined) {
		for (var i = 0; i < props.options.length; i++) {
			options.push(
				<div className="vote-option" key={props.options[i]}>
					{props.options[i]}{" "}
					<VoteButton
						index={i}
						button={props.button}
						vote={props.vote}
						setVote={props.setVote}
						credits={props.credits}
						setCurrentCredits={props.setCurrentCredits} />
				</div>
			);
		}
		//console.log(props.vote)
		return options;
	} else {
		return <></>;
	}
}
