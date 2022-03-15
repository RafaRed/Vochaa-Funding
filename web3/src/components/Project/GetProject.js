import { useEffect } from "react";
import { getProject, getProposals } from "../../model/projectModel";

export function GetProject(params, setProject, setProposals) {
	useEffect(() => {
		const db = getProject(params, setProject);
		getProposals(db, params, setProposals);
	}, []);
}
