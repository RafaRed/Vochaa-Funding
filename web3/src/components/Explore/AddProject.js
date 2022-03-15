import React from "react";

export function AddProject(props) {
	return (
		<p className="description">
			or{" "}
			<a className={props.links} href="/create-project">
				add a project you know
			</a>
		</p>
	);
}
