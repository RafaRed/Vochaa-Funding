import React, { useState } from "react";
import "../css/CreateContest.css";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { AddProjectButton } from "../components/ProjectForm/AddProjectButton";

function CreateProject(props) {
	const [chain, setChain] = useState(137);
	const [contest, setContest] = useState({});
	const [appData, setAppData] = useState({
		name: "Application Name",
		symbol: "ABC",
		logo: "",
		contract: "0x0000000000000000000000000000000000000000",
	});
	const [status, setStatus] = useState("");
	const [wallet, setWallet] = useState();

	const handleOnChangeContestData = (e, functionValue, setFunction, prop) => {
		var currentValues = functionValue;
		currentValues[prop] = e.target.value;
		setFunction(currentValues);
	};

	return (
		<>
			<Navbar menu="explore" setWallet={setWallet} />
			<div className="project">
				<div className="wrapper">
					<div className="header">
						<div className="horizontalBar"></div>
						<div>
							<Title />
							<Description />
						</div>
					</div>

					<BlockName
						buttonStyle={props.classes.buttonStyle}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "name")
						}></BlockName>

					<BlockDescription
						buttonStyle={props.classes.buttonStyle}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "description")
						}></BlockDescription>

					<BlockLogo
						buttonStyle={props.classes.buttonStyle}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "logourl")
						}></BlockLogo>

					<AddProjectButton
						wallet={wallet}
						appData={appData}
						status={status}
						appContract={appData.contract}
						buttonStyle={props.classes.button}
					/>
				</div>
			</div>
		</>
	);
}

function Title() {
	return <h1 className="title">Add a Contest</h1>;
}

function Description() {
	return <p className="description">Here you can create your own contest.</p>;
}

function BlockName(props) {
	return (
		<div className="block">
			<h2 className="block-title">Name</h2>
			<p className="block-description">Enter the name of your contest</p>
			<input
				type="text"
				id="fname"
				name="fname"
				onChange={props.handleOnChangeContestData}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
		</div>
	);
}

function BlockDescription(props) {
	return (
		<div className="block">
			<h2 className="block-title">Description</h2>
			<p className="block-description">Enter the contest description and rules</p>
			<input
				type="text"
				id="fname"
				name="fname"
				onChange={props.handleOnChangeContestData}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
		</div>
	);
}

function BlockLogo(props) {
	return (
		<div className="block-image">
			<div className="lazy-image"></div>
			<div className="content">
			<h2 className="block-image-title">Contest Logo</h2>
				<p className="block-image-description">Add the contest logo url</p>
				<input
					type="text"
					id="fname"
					name="fname"
					onChange={props.handleOnChangeContestData}
					className={["block-image-input", props.buttonStyle].join(" ")}
				/>
			</div>
			
		</div>
	);
}
const styles = {
	button: {
		"&:hover": {
			backgroundColor: "#40a9ff",
		},
	},

	chip: {
		"&:hover": {
			backgroundColor: "#dddddd",
		},
	},
};

export default injectSheet(styles)(CreateProject);
