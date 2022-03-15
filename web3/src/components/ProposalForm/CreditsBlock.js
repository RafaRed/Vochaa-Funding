import React from "react";

export function CreditsBlock(props) {
	var credits = props.credits;
	if (credits == undefined) {
		credits = 100;
		props.setCredits(100);
	}
	if (credits < 10) {
		credits = 10;
		props.setCredits(10);
	}

	return (
		<div className="block">
			<h1 className="title">Credits</h1>
			<p className="description">How many credits will each voter receive?</p>
			<input
				type="number"
				min="10"
				max="1000"
				defaultValue="100"
				onChange={(event) => {
					if (event.target.value.length >= 4) {
						event.target.value = "1000";
					}
					if (event.target.value.length <= 1) {
						event.target.value = "10";
					}

					props.setCredits(event?.target.value);
				}}
				id="fname"
				name="fname"
				className={["block-input"].join(" ")} />
		</div>
	);
}
