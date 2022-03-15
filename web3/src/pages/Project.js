import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../css/Project.css";
import Navbar from "../components/Navbar";
import injectSheet from "react-jss";
import { RenderProposals } from "../components/Project/RenderProposals";
import { ProjectLogo, ProjectName, ProjectSymbol, ProjectContract } from "../components/Project/ProjectComponents";
import { GetProject } from "../components/Project/GetProject";
import { CreateProposalButton } from "../components/Project/CreateProposalButton";

function Project(props) {
	const [project, setProject] = useState({ name: "", symbol: "", address: "" });
	const [proposals, setProposals] = useState({});
	const params = useParams();

	GetProject(params, setProject, setProposals);

	return (
		<>
			<Navbar menu="explore" />
			<div className="proj">
				<div className="wrapper">
					<div className="centred-block">
						<ProjectLogo logo={project.logo} />
						<div className="line">
							<ProjectName name={project.name} />
							<ProjectSymbol symbol={project.symbol} />
						</div>
						<ProjectContract address={project.address} />
						<CreateProposalButton
							button={props.classes.button}
							project={params.project}
						/>
					</div>
					<p className="proposals">Proposals</p>
					<div>
						<RenderProposals proposals={proposals} address={params.project} />
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
};

export default injectSheet(styles)(Project);
