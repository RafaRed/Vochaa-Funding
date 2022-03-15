import React, { useState } from "react";
import "../css/CreateProject.css";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { ChainChip } from "../components/ProjectForm/ChainChip";
import { SearchSmartContract, DisplayContractData } from "../components/ProjectForm/SmartContract";
import { AddProjectButton } from "../components/ProjectForm/AddProjectButton";


function CreateProject(props) {
	const [chain, setChain] = useState(137);
	const [contract, setContract] = useState("");
	const [appData, setAppData] = useState({
		name: "Application Name",
		symbol: "ABC",
		logo: "",
		contract: "0x0000000000000000000000000000000000000000",
	});
	const [status, setStatus] = useState("");
	const [wallet, setWallet] = useState();

	const handleOnChangeContract = (e) => {
		setContract(e.target.value);
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
					<div className="block">
						<h2 className="block-title">Network</h2>
						<p className="block-description">
							Choose the network that supports the application
						</p>

						<div className="chips">
							<ChainChip
								chainId={"matic-mainnet"}
								chipStyle={props.classes.chip}
								setChain={setChain}
								chain={chain}
							/>
							<ChainChip
								chainId={"bsc-mainnet"}
								chipStyle={props.classes.chip}
								setChain={setChain}
								chain={chain}
							/>
							<ChainChip
								chainId={"avalanche-mainnet"}
								chipStyle={props.classes.chip}
								setChain={setChain}
								chain={chain}
							/>
						</div>
					</div>

					<div className="block">
						<SearchSmartContract
							handleOnChangeContract={handleOnChangeContract}
							inputStyle={props.classes.input}
							chain={chain}
							contract={contract}
							setAppData={setAppData}
							setStatus={setStatus}
							buttonStyle={props.classes.buttonStyle}
							status={status}
						/>
					</div>

					<DisplayContractData appData={appData} />

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
	return <h1 className="title">Add a Project</h1>;
}

function Description() {
	return (
		<p className="description">
			Anyone can add a project to the plataform, but remember the project need to
			have a smart contract.
		</p>
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
