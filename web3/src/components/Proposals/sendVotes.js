import { getDatabase, ref, onValue, runTransaction } from "firebase/database";

export function SendVotes(votes, address, proposal, wallet) {
	if (wallet !== undefined) {
		const db = getDatabase();
		var _voters = [];
		var votersUrl = "proposals/" + address + "/" + proposal + "/" + "voters";
		const votersRef = ref(db, votersUrl);

		onValue(votersRef, (snapshot) => {
			const data = snapshot.val();
			_voters = data;
		});

		if (!_voters.includes(wallet)) {
			runTransaction(votersRef, (voters) => {
				if (voters) {
					voters.push(wallet);
				}
				return voters;
			});

			var update = "proposals/" + address + "/" + proposal + "/" + "votes";
			//console.log(update)
			const voteRef = ref(db, update);
			runTransaction(voteRef, (vote) => {
				if (vote) {
					console.log(votes.length);
					for (var i = 0; i < votes.length; i++) {
						if (votes[i] !== 0) {
							vote[i] += votes[i];
						}
					}
				}
				return vote;
			});
		} else {
			alert("You already voted before.");
		}
	} else {
		alert("Please connect to your wallet first.");
	}
}
