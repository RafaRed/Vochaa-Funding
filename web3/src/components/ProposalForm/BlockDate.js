import React from "react";
import Datetime from "react-datetime";
import moment from "moment";

export function BlockDate(props) {
	return (
		<div className="block">
			<h1 className="title">When is it going to happen?</h1>
			<p className="description">Select an start date</p>
			<div className="input-day">
				<Datetime
					isValidDate={(current) => valid(current, props.endDate)}
					onClose={(day) => handleDayChange(day, props.setStartDate)}
					onC />
			</div>

			<p className="description">Select an ending date</p>
			<div className="input-day">
				<Datetime
					isValidDate={(current) => validFrom(current, props.startDate)}
					onClose={(day) => handleDayChange(day, props.setEndDate)} />
			</div>
		</div>
	);
}

function valid(current, end) {
	var now = moment();

	if (end == undefined || end == "") {
		return current.isAfter(now.subtract(1, "days"));
	} else {
		return current.isAfter(now) && current.isBefore(end);
	}
}

function handleDayChange(day, setter) {
	console.log(day);
	if (day !== "") {
		//var CurrentDate = moment().unix();
		setter(day);
	}
}

function validFrom(current, start) {
	return current.isAfter(start);
}