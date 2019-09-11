import React from 'react';
import './App.css';
import axios from 'axios';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Zwitter from './Zwitter.js';
import Exam from './Exam.js';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="LeftsideBar">
            <ul>
              <li><Link to="/">Zwitter</Link></li>
              <li><Link to="/exam">Exam</Link></li>
            </ul>
          </div>
          <Route exact path="/" component={Zwitter} />
          <Route path="/exam" component={Exam} />
        </Router>
      </div>
    );
  }
}

export default App;

// Test Using Axios

// axios
//   .get('api/users')
//   .then(response => {
//     console.log(response.data);
//   })
//   .catch(err => {
//     console.log(err);
//   })
