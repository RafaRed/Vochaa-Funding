import React, { useState, useRef, useEffect } from "react";
import "../css/CreateContest.css";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { BlockDate } from "../components/ProposalForm/BlockDate";
import { AddProjectButton } from "../components/ProjectForm/AddProjectButton";

function CreateProject(props) {
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [dataChanged,setDataChanged] = useState(false);
	const [contest, setContest] = useState({});
	const [repositories, setRepositories] = useState([]);
	const repositoryName = useRef();
	const repositoryDescription = useRef();
	const repositoryURL = useRef();
	const [status, setStatus] = useState("");
	const [username, setUsername] = useState("");

	const handleOnChangeContestData = (e, functionValue, setFunction, prop) => {
		var currentValues = functionValue;
		currentValues[prop] = e.target.value;
		setDataChanged(true)
		setFunction(currentValues);
	};

	return (
		<>
			<Navbar menu="explore" setUsername={setUsername} username={username}/>
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
						logourl={contest.logourl}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "logourl")
						}></BlockLogo>

					<BlockCredits
						buttonStyle={props.classes.buttonStyle}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "credits")
						}></BlockCredits>

					<BlockFunding
						buttonStyle={props.classes.buttonStyle}
						handleOnChangeContestData={(e) =>
							handleOnChangeContestData(e, contest, setContest, "funding")
						}></BlockFunding>

					<BlockAddRepositories
						buttonStyle={props.classes.buttonStyle}
						repositoryName={repositoryName}
						handleOnChangeRepositoryName={(e) =>
							handleOnChangeContestData(e, contest, setContest, "repositoryName")
						}
						handleOnChangeRepositoryURL={(e) =>
							handleOnChangeContestData(e, contest, setContest, "repositoryURL")
						}
						contest={contest}
						setContest={setContest}
						handleOnChangeRepositoryDescription={(e) =>
							handleOnChangeContestData(
								e,
								contest,
								setContest,
								"repositoryDescription"
							)
						}
						repositoryDescription={repositoryDescription}
						repositoryURL={repositoryURL}
						repositories={repositories}
						setRepositories={setRepositories}></BlockAddRepositories>

					<BlockShowRepositories repositories={repositories} setRepositories={setRepositories}></BlockShowRepositories>

					<BlockDate
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}></BlockDate>

					<AddProjectButton
						username={username}
						contest={contest}
						startDate={startDate}
						endDate={endDate}
						repositories={repositories}
						buttonStyle={props.classes.button}
						dataChanged={dataChanged}
						setDataChanged={setDataChanged}
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
				onChange={props.handleOnChangeContestData}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
		</div>
	);
}

function BlockLogo(props) {
	return (
		<div className="block-image">
			<div >
				<img className="lazy-image" src={props.logourl}></img>
			</div>
			<div className="content">
				<h2 className="block-image-title">Contest Logo</h2>
				<p className="block-image-description">Add the contest logo url</p>
				<input
					type="text"
					onChange={props.handleOnChangeContestData}
					className={["block-image-input", props.buttonStyle].join(" ")}
				/>
			</div>
		</div>
	);
}

function BlockCredits(props) {
	return (
		<div className="block">
			<h2 className="block-title">Credits</h2>
			<p className="block-description">
				How many credits will each voter receive?
			</p>
			<input
				type="number"
				onChange={props.handleOnChangeContestData}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
		</div>
	);
}

function BlockFunding(props) {
	return (
		<div className="block">
			<h2 className="block-title">Funding</h2>
			<p className="block-description">How much is the funding pool?</p>
			<input
				type="number"
				onChange={props.handleOnChangeContestData}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
		</div>
	);
}

function BlockAddRepositories(props) {
	return (
		<div className="block">
			<h2 className="block-title">Repositories</h2>
			<p className="block-description">
				Add the publics repositories for the contest
			</p>
			<p>Repository Name</p>
			<input
				type="text"
				ref={props.repositoryName}
				onChange={props.contest.repositoryName}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
			<p>Repository Description</p>
			<input
				type="text"
				ref={props.repositoryDescription}
				onChange={props.handleOnChangeRepositoryDescription}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
			<p>Repository Url</p>
			<input
				type="text"
				ref={props.repositoryURL}
				onChange={props.handleOnChangeRepositoryURL}
				className={["block-input", props.buttonStyle].join(" ")}
			/>
			<button onClick={() => addRepository(props)} className="add-button-mini">
				Add Repository
			</button>
		</div>
	);
}

function addRepository(props) {
	if (
		props.repositoryName.current.value != "" &&
		props.repositoryDescription.current.value != ""
		&& props.repositoryURL.current.value != ""
	) {
		var data = {
			name: props.repositoryName.current.value,
			description: props.repositoryDescription.current.value,
			url: props.repositoryURL.current.value,
		};
		props.setRepositories([...props.repositories, data]);
		props.repositoryName.current.value = "";
		props.repositoryDescription.current.value = "";
		props.repositoryURL.current.value = "";
	}
}

function BlockShowRepositories(props) {
	var data = FetchRepositories(props);
	return <div className="block">{data}</div>;
}

function FetchRepositories(props) {
		var rows = [];
		for (var i = 0; i < props.repositories.length; i++) {
			rows.push(
				repositoryItem(
					props.repositories[i].name,
					props.repositories[i].description,
					props.repositories[i].url,
					i,
					props.repositories,
					props.setRepositories
				)
			);
		}
		return <div>{rows}</div>;
	
}

function repositoryItem(name, description, url, id, repositories, setRepositories) {
	return (
		<div key={id}>
			<h2 className="block-title">{name}</h2>
			<p className="block-description">{description}</p>
			<p className="block-description">{url}</p>
			<button
				onClick={() => removeRepositoryItem(id, repositories, setRepositories)}>
				remove
			</button>
		</div>
	);
}

function removeRepositoryItem(id, repositories, setRepositories) {
	var array = [...repositories];
	if (id !== -1) {
	  array.splice(id, 1);
	  setRepositories(array);
	}

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
