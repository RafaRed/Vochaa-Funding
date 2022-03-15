import React from "react";

export function CreateProposalButton(props) {
	return (
		<a
			href={"/contest/" + props.project + "/create-proposal"}
			className={["add-button", props.button].join(" ")}>
			CREATE PROPOSAL
		</a>
	);
}
