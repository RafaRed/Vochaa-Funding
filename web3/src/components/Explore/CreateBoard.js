import React from "react";
import { Link } from "react-router-dom";

export function CreateBoard(props) {
	const projectWidgets = [];
	if (props.projects !== undefined && Object.keys(props.projects).length > 0) {
		for (const [key, value] of Object.entries(props.projects)) {
			const item = props.projects[key];
			if (props.search == undefined ||
				item["name"].toLowerCase().startsWith(props.search.toLowerCase())) {
				const project = (
					<Link to={"/project/" + props.projects[key].address} key={item["name"]}>
						<div className={[props.classes.app, "app"].join(" ")}>
							<div className="app-logo">
								<img src={item["logo"]} />
							</div>
							<p className="app-name">{item["name"]}</p>
						</div>
					</Link>
				);
				projectWidgets.push(project);
			}
		}
	}

	return projectWidgets;
}
