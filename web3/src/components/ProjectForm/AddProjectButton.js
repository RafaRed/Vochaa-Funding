import React from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";

export function AddProjectButton({
	wallet, appData, status, appContract, buttonStyle,
}) {

	const requestProjectCreation = () => {
		if (appData.contract !== 0x0000000000000000000000000000000000000000 &&
			status === "Done") {
			addProject(appData, wallet);
		} else {
			alert("cannot add this project.");
		}
	};

	return (
		<button
			type="button"
			onClick={wallet == undefined
				? () => alert("Please connect to your wallet first.")
				: requestProjectCreation}
			className={[
				appContract === "0x0000000000000000000000000000000000000000"
					? ""
					: buttonStyle,
				appContract === "0x0000000000000000000000000000000000000000"
					? "add-button-off"
					: "add-button",
			].join(" ")}>
			ADD THIS PROJECT
		</button>
	);
}

async function addProject(appData, wallet) {
	const db = getDatabase();
	await set(ref(db, "projects/" + appData.contract), {
		name: appData.name,
		logo: appData.logo,
		symbol: appData.symbol,
		address: appData.contract,
		sender: wallet,
	});

	window.location.href = "/project" + "/" + appData.contract;
}