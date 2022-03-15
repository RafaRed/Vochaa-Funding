import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/CreateProposal.css";
import Navbar from "../components/Navbar";
import "react-datetime/css/react-datetime.css";
import injectSheet from "react-jss";
import { onValue } from "firebase/database";
import { BlockName } from "../components/ProposalForm/BlockName";
import { BlockDescription } from "../components/ProposalForm/BlockDescription";
import { BlockDate } from "../components/ProposalForm/BlockDate";
import { BlockOptions } from "../components/ProposalForm/BlockOptions";
import { CreditsBlock } from "../components/ProposalForm/CreditsBlock";
import { ValidadeAndSubmitButton } from "../components/ProposalForm/SubmitProposal";

function CreateProposal(props) {
	const params = useParams();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [credits, setCredits] = useState(100);
	const [option, setOption] = useState("");
	const [options, setOptions] = useState([]);
	const [wallet, setWallet] = useState();

	return (
		<>
			<Navbar menu="explore" setWallet={setWallet} />
			<div className="create-proposal">
				<div className="wrapper">
					<div className="header">
						<div className="horizontalBar"></div>
						<div>
							<Title></Title>
							<Description></Description>
						</div>
					</div>
					<BlockName setName={setName}></BlockName>
					<BlockDescription setDescription={setDescription}></BlockDescription>
					<BlockDate
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}></BlockDate>
					<CreditsBlock
						credits={props.credits}
						setCredits={() => props.setCredits}
					/>
					<BlockOptions
						button={props.classes.button}
						classes={props.classes}
						option={option}
						setOption={setOption}
						options={options}
						setOptions={setOptions}></BlockOptions>

					<ValidadeAndSubmitButton
						address={params.project}
						classes={props.classes}
						name={name}
						description={description}
						credits={credits}
						startDate={startDate}
						endDate={endDate}
						options={options}
						wallet={wallet}
					/>
				</div>
			</div>
		</>
	);
}

function Title() {
	return <h1 className="title">Create an Proposal</h1>;
}

function Description() {
	return (
		<p className="description">
			To create an proposal, simply fill out the event settings, add your options,
			and we will generate you quicklinks that you can share with your audience.
		</p>
	);
}

const styles = {
	button: {
		"&:hover": {
			backgroundColor: "#40a9ff",
		},
	},
	trash: {
		"&:hover": {
			backgroundColor: "#ff6e6e",
		},
	},
};

export default injectSheet(styles)(CreateProposal);
