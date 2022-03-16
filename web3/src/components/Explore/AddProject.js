import React from "react";

export function AddContest(props) {
	return (
		<p className="description">
			or{" "}
			<a className={props.links} href="/create-contest">
				create a contest
			</a>
		</p>
	);
}
