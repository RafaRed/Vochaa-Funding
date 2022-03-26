import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { sendVotes } from "../../model/Calls/Database";

export function SendVotes(contestid, repositoryid, pullrequestid, vote, username) {
	if (username !== undefined && username !== "") {
		sendVotes(contestid,repositoryid,pullrequestid,vote)
		.then(() => window.location.reload(false))
	} else {
		alert("Please connect to your account first.");
	}
}
