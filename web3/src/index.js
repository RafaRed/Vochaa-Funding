import React from "react";
import ReactDOM from "react-dom";
import firebase from "./model/firebaseConnect";
import App from "./pages/App";
import Explore from "./pages/Explore";
import Contest from "./pages/Contest";
import CreateProposal from "./pages/CreateProposal";
import CreateContest from "./pages/CreateContest";
import RepositoriesExplorer from "./pages/RepositoriesExplorer";
import Proposal from "./pages/Proposal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SetupContest from "./pages/SetupContest";
import Task from "./pages/Task";
import {Provider} from 'react-redux'
import store from './store'


ReactDOM.render(
  <Provider store={store}>
  <Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route exact path="/create-contest" element={<CreateContest/>} />
      <Route exact path="/explore" element={<Explore/>} />
      <Route exact path="/contest/:contest" element={<SetupContest/>} />
      <Route exact path="/contest/:contest/tasks" element={<RepositoriesExplorer/>} />
      <Route exact path="/contest/:contest/:task" element={<Task/>} />
      <Route exact path="/contest/:contest/create-proposal" element={<CreateProposal/>} />
      <Route exact path="/contest/:contest/:task/:proposal" element={<Proposal/>} />
      </Routes>
    </Router>
    </Provider>,

  document.getElementById("root")
);
