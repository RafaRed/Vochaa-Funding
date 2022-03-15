function getCredits(props, value) {
	var credits = props.credits;

	for (var i = 0; i < props.vote.length; i++) {
		if (i === props.index) {
			credits -= Math.abs(props.vote[i] + value) ** 2;
		} else {
			credits -= Math.abs(props.vote[i]) ** 2;
		}
	}
	return credits;
}
export function reduceVote(props) {
	var credits = getCredits(props, -1);
	if (credits >= 0) {
		var votes = props.vote;
		votes[props.index] -= 1;
		props.setVote((arr) => [...votes]);
		props.setCurrentCredits(credits);
	}
}
export function addVote(props) {
	var credits = getCredits(props, +1);
	if (credits >= 0) {
		var votes = props.vote;
		votes[props.index] += 1;
		props.setVote((arr) => [...votes]);
		props.setCurrentCredits(credits);
	}
}
