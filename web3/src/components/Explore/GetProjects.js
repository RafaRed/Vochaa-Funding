import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { getProjects } from "../../model/Calls/Database";

export function GetProjects(setProjects) {
	useEffect(() => {
		getProjects()
		.then(projectList =>{
			setProjects(projectList);
		})
		
	}, []);
}
