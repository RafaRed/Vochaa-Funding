import React from "react";
import chains from "../Networks";

export function ChainChip({ chainId, chipStyle, setChain, chain }) {
	return (
		<div
			onClick={() => setChain(chains[chainId].chain_id)}
			className={[
				chipStyle,
				"chip",
				chain == chains[chainId].chain_id ? "active" : "",
			].join(" ")}>
			<img src={chains[chainId].logo_url} />
			<p>{chains[chainId].label}</p>
		</div>
	);
}
