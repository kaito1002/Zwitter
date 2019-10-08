import React from 'react';
import './App.css';

// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { HashRouter, Switch, Route } from 'react-router-dom';

import AppIndex from './AppIndex.js';
import Login from './Login.js';
import Zwitter from './Zwitter.js';
import Exam from './Exam.js';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Switch>
            <Route exact path="/" component={AppIndex} />
            <Route path="/Login" component={Login} />
            <Route path="/Zwitter" component={Zwitter} />
            <Route path="/Exam" component={Exam} />
            {/* <Route component={Zwitter} /> */}
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default App;