import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

export function GetProjects(setProjects) {
	useEffect(() => {
		const db = getDatabase();
		const starCountRef = ref(db, "projects/");
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			const projectList = {};
			for (let project in data) {
				projectList[data[project]["address"]] = data[project];
			}
			setProjects(projectList);
		});
	}, []);
}
