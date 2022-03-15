import React from "react";

export function SearchBar(props) {
	return (
		<div className="search-bar">
			<input
				type="text"
				id="fname"
				name="fname"
				className="block-input"
				onChange={(val) => props.setSearch(val.target.value)} />
			<img src="/images/search.png" />
		</div>
	);
}
