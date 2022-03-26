function getCredits(props, value) {
	var credits = props.credits;

	credits -= Math.abs(props.vote + value + props.oldVotes ) ** 2 - (props.oldVotes ** 2);
	return credits;
}
export function reduceVote(props) {
	var credits = getCredits(props, -1);
	if (credits >= 0) {
		if(props.vote >= 1){
			var votes = props.vote;
			votes -= 1;
			props.setVote(votes);
			props.setCurrentCredits(credits);
		}
		
	}
}
export function addVote(props) {
	var credits = getCredits(props, +1);
	if (credits >= 0) {
		var votes = props.vote;
		votes += 1;
		props.setVote(votes);
		props.setCurrentCredits(credits);
	}
}
