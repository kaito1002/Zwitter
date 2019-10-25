import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import AppIndex from "./AppIndex.js";
import Login from "./Login.js";
import CreateAccount from './CreateAccount.js';
import Zwitter from "./Zwitter.js";
import Exam from "./Exam.js";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={AppIndex} />
            <Route path="/Login" component={Login} />
            <Route path="/CreateAccount" component={CreateAccount} />
            <Route path="/Zwitter" component={Zwitter} />
            <Route path="/Exam" component={Exam} />
            <Route component={AppIndex} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
