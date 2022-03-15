import React from "react";

export function SearchSmartContract({
	handleOnChangeContract, inputStyle, chain, contract, setAppData, setStatus, buttonStyle, status,
}) {
	return (
		<>
			<h2 className="block-title">Contract Address</h2>
			<p className="block-description">
				Enter the smart contract address of the application
			</p>
			<div className="contract">
				<input
					type="text"
					id="fname"
					name="fname"
					onChange={handleOnChangeContract}
					className={["block-input", inputStyle].join(" ")} />
				<button
					onClick={() => searchContract(chain, contract, setAppData, setStatus)}
					type="button"
					className={[buttonStyle, "search-button"].join(" ")}>
					SEARCH
				</button>
			</div>
			<p className="status">{status}</p>
		</>
	);
}
export function DisplayContractData({ appData }) {
	return (
		<div className="centred-block">
			<div className="app-logo">
				<img src={appData.logo} />
			</div>
			<div className="line">
				<p className="app-name">{appData.name}</p>
				<p className="app-symbol">{appData.symbol}</p>
			</div>
			<div className="app-contract">
				<p>{appData.contract}</p>
			</div>
		</div>
	);
}

async function searchContract(chain, contract, setAppData, setStatus) {
	if (isValidAddress(contract)) {
		//const url = "https://api.covalenthq.com/v1/"+chain+"/tokens/tokenlists/all/?key="+process.env.REACT_APP_COVALANT_API+"&match=%7B%22contract_address%22:%22"+contract+"%22%7D"
		const url =
			"https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/" +
			chain +
			"/usd/" +
			contract +
			"/?&key=" +
			process.env.REACT_APP_COVALANT_API;
		setStatus("Searching...");
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				if (data.error_message !== null) {
					setStatus(data.error_message);
				}
				if (data.data.length <= 0) {
					setStatus(
						"Contract not found, check if the address and network is correct."
					);
				}

				setAppData({
					name: data.data[0].contract_name,
					symbol: data.data[0].contract_ticker_symbol,
					logo: data.data[0].logo_url.replace("/tokens/", "/tokens/" + chain + "/"),
					contract: data.data[0].contract_address,
				});
				setStatus("Done");
			});
	} else {
		setStatus("Invalid Address");
	}
}

function isValidAddress(address) {
	if (address == "") {
		return false;
	}
	return true;
}
