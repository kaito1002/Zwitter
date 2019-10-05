import React from 'react';
import './Login.css';

import axios from 'axios';
// import { BrouserRouter as Router, Route } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: undefined,
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.sendUserInformation = this.sendUserInformation.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this)
  }

  sendUserInformation() {
    axios
      .post('/api-token-auth/', {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        console.log(response.data.token);
        this.updateLocalStorage(response.data.token, 'storedToken')
      })
      .catch(err => {
        console.log(err);
      })
  }

  changeUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  changePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  updateLocalStorage(data, name) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  render() {
    return (
      <div className="Login">
        <h1>Login Page</h1>
        <p>学籍番号</p>
        <input type="text" name="username" value={this.username}
          onChange={(e) => this.changeUsername(e)}></input>
        <p>パスワード</p>
        <input type="password" name="password" value={this.state.password}
          onChange={(e) => this.changePassword(e)}></input>
        <input type="submit" name="submit" onClick={() => this.sendUserInformation()}>
        </input>
      </div>
    )
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (storedToken) {
      this.setState({
        token: storedToken
      });
    };
  }
}

export default Login;