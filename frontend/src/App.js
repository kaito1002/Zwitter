import React from 'react';
import './App.css';
// import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Zwitter from './Zwitter.js';
import Exam from './Exam.js';
import Login from './Login.js';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="LeftsideBar">
            <ul>
              <li><Link to="/">
                <FontAwesomeIcon icon={['fas', 'comment']} size="5x" />
              </Link></li>
              <li><Link to="/exam">
                <FontAwesomeIcon icon={['fas', 'pencil-ruler']} size="5x" />
              </Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <Route exact path="/" component={Zwitter} />
          <Route path="/exam" component={Exam} />
          <Route path="/login" component={Login} />
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
