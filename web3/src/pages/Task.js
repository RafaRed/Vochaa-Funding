import React, { useState } from "react";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { useParams } from "react-router-dom";
import "../css/Task.css";

function Task() {
	const [username, setUsername] = useState("");
	const params = useParams();
	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="task">
				<div className="wrapper">
					<div className="task-info">
						<div className="block-info">
							<div className="block-wrapper">
								<div className="logo">
									<img src=""></img>
								</div>
								<div className="task-data">
									<h2>Task Name</h2>
									<p className="task-date">From 03/10/2022 to 03/15/2022</p>
									<a
										className="task-url"
										href="https://github.com/sshaw/export-pull-requests/issues/23">
										https://github.com/sshaw/export-pull-requests/issues/23
									</a>
								</div>
							</div>
							<p className="task-description">
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry. Lorem Ipsum has been the industry's standard dummy text ever
								since the has been the industry's standard dummy text ever since the
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry. Lorem Ipsum has been the industry's standard dummy text ever
								since the has been the industry's standard dummy text ever since the
							</p>
						</div>
						<div className="block-contest">
							<div className="contest-logo">
								<img src=""></img>
							</div>
							<h2>Contest Name</h2>
						</div>
					</div>
					<div className="search-bar">
						<input type="text" id="fname" name="fname" className="block-input" />
						<img src="/images/search.png" />
					</div>
					<div className="board">
						<FetchPullRequests></FetchPullRequests>
					</div>
				</div>
			</div>
		</>
	);
}

function FetchPullRequests() {
	return [PullRequest(), PullRequest(), PullRequest()];
}

function PullRequest() {
	return (
		<div className="pr">
			<p className="pr-id">#1</p>
			<p className="pr-name">Pull Request Big Title</p>
			<div className="pr-info">
				<p>by</p> <a className="pr-author">Author Name</a> <p>at</p>
				<p className="pr-date">03/14/2022</p>
			</div>
			<p className="pr-description">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry.
				Lorem Ipsum has been the industry's standard dummy text ever since the has
				been the industry's standard dummy text ever since the
			</p>
			<div className="divider"></div>
			<p className="pr-from">
				From <a>Repository Title</a>
			</p>
			<p>Contributors</p>
			<p>50</p>
			<p>Value Match</p>
			<p>$600 0.05%</p>
            <button className="view-button">View More</button>
		</div>
	);
}

const styles = {
	links: {
		textDecoration: "none",
		color: "#fff",
		"&:hover": {
			color: "#3191FF",
		},
	},
	app: {
		backgroundColor: "#95c3f7",
		"&:hover": {
			backgroundColor: "#aed4ff",
		},
	},
};

export default injectSheet(styles)(Task);
