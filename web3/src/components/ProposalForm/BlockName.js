import React from "react";

export function BlockName(props) {
	return (
		<div className="block">
			<h1 className="title">Name</h1>
			<p className="description">Choose a name for your proposal</p>
			<input
				type="text"
				id="fname"
				name="fname"
				onChange={(e) => props.setName(e.target.value)}
				className={["block-input"].join(" ")} />
		</div>
	);
}
