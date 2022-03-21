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
					<div className="project-block"><Link to={"/contest/" + props.projects[key].name +"/tasks"} key={item["name"]}>
						<div className={[props.classes.app, "app"].join(" ")}>
							<div className="app-logo">
								<img src={item["logourl"]} />
							</div>
							<p className="app-name">{item["name"]}</p>
						</div>
					</Link>
					<a href={"/contest/" + props.projects[key].name} key={item["name"]}>
					<button className={[props.classes.app, "edit-button"].join(" ")}>EDIT</button>
					</a>
					
					</div>
				);
				projectWidgets.push(project);
			}
		}
	}

	return projectWidgets;
}
