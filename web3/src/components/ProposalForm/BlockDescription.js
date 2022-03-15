import React from "react";

export function BlockDescription(props) {
	return (
		<div className="block">
			<h1 className="title">Description</h1>
			<p className="description">Describe your proposal</p>
			<textarea
				id="fname"
				maxLength="1500"
				name="fname"
				onChange={(e) => props.setDescription(e.target.value)}
				className={["block-input-long"].join(" ")} />
		</div>
	);
}
