import React from "react";

export function BlockOptions(props) {
	return (
		<div className="block">
			<h1 className="title">Options</h1>
			<p className="description">Add at least two options.</p>
			<div className="option-line">
				<input
					type="text"
					id="fname"
					name="fname"
					value={props.option}
					onChange={(e) => props.setOption(e.target.value)}
					className={["option-input"].join(" ")} />
				<button
					type="button"
					onClick={() => addOption(props.option, props.setOption, props.setOptions, props.options)}
					className={[
						props.option !== "" ? "plus-button" : "plus-button-disabled",
						props.option !== "" ? props.classes.button : "",
					].join(" ")}>
					<img src="/images/plus.png" className="button-image" />
				</button>
			</div>
			<div className="list-options">
				<ListOptions
					options={props.options}
					classes={props.classes}
					setOptions={props.setOptions} />
			</div>
		</div>
	);
}

function ListOptions(props) {
	var objects = [];
	for (var i = 0; i < props.options.length; i++) {
		const index = i;
		objects.push(
			<div className="option-line" key={index}>
				<div className="option">
					<p>{props.options[i]}</p>
				</div>
				<button
					type="button"
					onClick={() => removeOption(index, props.setOptions, props.options)}
					className={["trash-button", props.classes.trash].join(" ")}>
					<img src="/images/trash.png" className="button-image" />
				</button>
			</div>
		);
	}

	return objects;
}
function removeOption(index, setOptions, options) {
	const list = options;
	const newList = [];
	for (var i = 0; i < list.length; i++) {
		if (i == index) {
		} else {
			newList.push(list[i]);
		}
	}
	setOptions(newList);
}

function addOption(option, setOption, setOptions, options) {
	if (option !== "" && option !== undefined) {
		const list = options;
		list.push(option);
		setOptions(list);
		setOption("");
	}
}
