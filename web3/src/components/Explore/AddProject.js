import React from "react";

export function AddContest(props) {
	return (
		<p className="description">
			or{" "}
			<a className={props.links} href="/create-contest">
				add a contest
			</a>
		</p>
	);
}
