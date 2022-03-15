import React from "react";

export function ProjectLogo(props) {
	return (
		<div className="app-logo">
			<img src={props.logo} />
		</div>
	);
}
export function ProjectName(props) {
	return <p className="app-name">{props.name}</p>;
}
export function ProjectSymbol(props) {
	return <p className="app-symbol">{props.symbol}</p>;
}
export function ProjectContract(props) {
	return (
		<div className="app-contract">
			<p>{props.address}</p>
		</div>
	);
}
