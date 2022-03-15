import { getDatabase, ref, onValue } from "firebase/database";

export function getProject(params, setProject) {
	const db = getDatabase();
	const starCountRef = ref(db, "projects/");
	onValue(starCountRef, (snapshot) => {
		const data = snapshot.val();
		for (let project in data) {
			if (data[project]["address"] == params.project) {
				setProject(data[project]);
			}
		}
	});
	return db;
}

export function getProposals(db, params, setProposals) {
	var proposalsList = {};
	const proposalRef = ref(db, "proposals/" + params.project);
	onValue(proposalRef, (snapshot) => {
		const data = snapshot.val();
		for (let proposal in data) {
			proposalsList[proposal] = data[proposal];
		}
		setProposals(proposalsList);
	});
}