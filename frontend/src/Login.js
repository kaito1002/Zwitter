import React from 'react';

import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNumber: undefined,
      password: undefined,
      validationMessage: undefined,
    }
    this.changeUserNumber = this.changeUserNumber.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.loginAdministration = this.loginAdministration.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
  }

  changeUserNumber(e) {
    this.setState({
      userNumber: e.target.value
    })
  }

  changePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  loginAdministration() {
    // console.log(this.state.userNumber);
    // console.log(this.state.password);
    axios
      .post('/api-token-auth/', {
        username: this.state.userNumber,
        password: this.state.password
      })
      .then(response => {
        console.log(response.data.token);
        this.updateLocalStorage(response.data.token, 'storedToken');
        this.props.history.push('/Zwitter');
      })
      .catch(err => {
        this.setState({
          validationMessage: "学籍番号、またはパスワードが不正です"
        })
        console.log(err);
      })
  }

  updateLocalStorage(data, name) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  render() {
    return (
      <div className="Login">
        <h1>Login</h1>
        <p>User Number</p>
        <input type="text"
          onChange={(e) => this.changeUserNumber(e)} />
        <p>Password</p>
        <input type="password"
          onChange={(e) => this.changePassword(e)} />
        <p>
          <button type="submit"
            onClick={() => this.loginAdministration()}>
            Submit
          </button>
        </p>
        <h1>
          {this.state.validationMessage}
        </h1>
      </div>
    );
  }
}

export default withRouter(Login);