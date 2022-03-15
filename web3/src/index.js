import React from "react";
import ReactDOM from "react-dom";

import App from "./pages/App";
import Explore from "./pages/Explore";
import Project from "./pages/Project";
import CreateProposal from "./pages/CreateProposal";
import CreateProject from "./pages/CreateProject";
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
      <Route exact path="/create-project" element={<CreateProject/>} />
      <Route exact path="/explore" element={<Explore/>} />
      <Route exact path="/project/:project" element={<Project/>} />
      <Route exact path="/project/:project/create-proposal" element={<CreateProposal/>} />
      <Route exact path="/project/:project/:proposal" element={<Proposal/>} />
      </Routes>
    </Router>
    </Web3ReactProvider>,

  document.getElementById("root")
);
