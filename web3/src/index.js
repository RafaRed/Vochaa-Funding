import React from "react";
import ReactDOM from "react-dom";

import App from "./pages/App";
import Explore from "./pages/Explore";
import Contest from "./pages/Contest";
import CreateProposal from "./pages/CreateProposal";
import CreateContest from "./pages/CreateContest";
import Proposal from "./pages/Proposal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Web3ReactProvider } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers";


function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000

  return library
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
  <Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route exact path="/create-contest" element={<CreateContest/>} />
      <Route exact path="/explore" element={<Explore/>} />
      <Route exact path="/contest/:contest" element={<Contest/>} />
      <Route exact path="/contest/:contest/create-proposal" element={<CreateProposal/>} />
      <Route exact path="/contest/:contest/:proposal" element={<Proposal/>} />
      </Routes>
    </Router>
    </Web3ReactProvider>,

  document.getElementById("root")
);
