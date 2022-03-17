import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "../css/SetupContest.css";
import injectSheet from "react-jss";

function SetupContest() {
	const [username, setUsername] = useState("");
	return (
		<>
			<Navbar menu="explore" username={username} setUsername={setUsername} />
			<div className="setup-contest">
				<div className="wrapper">
					<div className="block">
						<div className="header">
							<div className="data">
								<div className="logo">
									<img src="" />
								</div>
								<div className="labels">
									<h2 className="block-title">Contest Name</h2>
									<p>from 03/14/2022 to 03/30/2022</p>
									<p>100 credits per user</p>
									<p>
										funding pool <span className="green">$80.000</span>
									</p>
								</div>
							</div>
							<button className="edit">EDIT</button>
						</div>
						<div className="content conteiner">
							Lorem Ipsum is simply dummy text of the printing and typesetting
							industry. Lorem Ipsum has been the industry's standard dummy text ever
							since the 1500s, when an unknown printer took a galley of type and
							scrambled it to make a type specimen book. It has survived not only five
							centuries, but also the leap into electronic typesetting, remaining
							essentially unchanged. Lorem Ipsum is simply dummy text of the printing
							and typesetting industry. Lorem Ipsum has been the industry's standard
							dummy text ever since the 1500s, when an unknown printer took a galley of
							type and scrambled it to make a type specimen book. It has
						</div>
					</div>

					<div className="block">
						<div className="pull-header">
							<h2 className="block-title">Pull Requests</h2>
							<div className="buttons">
								<button className="import">IMPORT CSV</button>
								<button className="save">SAVE</button>
							</div>
						</div>
						<div className="divider"></div>
					</div>
				</div>
			</div>
		</>
	);
}

const styles = {
	button: {
		"&:hover": {
			backgroundColor: "#40a9ff",
		},
	},
	setButton: {
		"&:hover": {
			backgroundColor: "#cccccc",
		},
	},
};

export default injectSheet(styles)(SetupContest);
