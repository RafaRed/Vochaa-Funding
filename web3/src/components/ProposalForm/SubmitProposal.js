import React from "react";
import moment from "moment";
import { getDatabase, ref, push } from "firebase/database";



async function submitProposal(
	address,
	name,
	description,
	startDate,
	endDate,
	credits,
	options,
	wallet
) {
	const db = getDatabase();
	var votes = [];
	for (var i = 0; i < options.length; i++) {
		votes.push(0);
	}
	var doc = await push(ref(db, "proposals/" + address), {
		timestamp: moment().unix(),
		name: name,
		description: description,
		startDate: startDate.unix(),
		endDate: endDate.unix(),
		credits: credits,
		options: options,
		votes: votes,
		voters: [""],
		sender: wallet,
	});

	window.location.href = "/project" + "/" + address + "/" + doc.key;
}
export function ValidadeAndSubmitButton(props) {
	console.log(props.options);
	if (props.credits >= 10 &&
		props.name.length >= 3 &&
		props.name.length <= 30 &&
		props.description.length >= 5 &&
		props.description.length <= 1500 &&
		props.startDate !== undefined &&
		props.endDate !== undefined &&
		props.startDate.isAfter(moment().subtract(1, "days")) &&
		props.endDate.isAfter(props.startDate) &&
		props.options.length >= 2) {
		return (
			<button
				type="button"
				onClick={props.wallet === undefined
					? () => alert("Please connect to your wallet first.")
					: () => submitProposal(
						props.address,
						props.name,
						props.description,
						props.startDate,
						props.endDate,
						props.credits,
						props.options,
						props.wallet
					)}
				className={["add-button", props.classes.button].join(" ")}>
				SUBMIT PROPOSAL
			</button>
		);
	} else {
		return (
			<button type="button" className={["add-button-disabled"].join(" ")}>
				SUBMIT PROPOSAL
			</button>
		);
	}
}
