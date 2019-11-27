import React from 'react';

import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNumber: undefined,
      password: undefined,
      isShowPass: "password",
    };
    this.changeUserNumber = this.changeUserNumber.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.loginAdministration = this.loginAdministration.bind(this);
    this.updateLocalStorage = this.updateLocalStorage.bind(this);
    this.changeVisibilityPass = this.changeVisibilityPass.bind(this);
    this.keydownEnter = this.keydownEnter.bind(this);

    this.userNumberForm = React.createRef();
    this.passwordForm = React.createRef();
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
        window.alert("学籍番号、またはパスワードが不正です。")
        console.log(err);
      })
  }

  updateLocalStorage(data, name) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  changeVisibilityPass(){
    if(this.state.isShowPass === "password"){
      this.setState({
        isShowPass: "text"
      });
    }else{
      this.setState({
        isShowPass: "password"
      });
    }
  }

  keydownEnter(e, pass=false){
    const ENTER = 13;
    if(e.keyCode === ENTER){
      if(pass) {
        this.loginAdministration();
      }else{
        this.passwordForm.current.focus();
      }
    }
  }

  render() {
    return (
      <div className="Login">
        <h1>Login</h1>
        <p>
          <input type="text"
                 onChange={(e) => this.changeUserNumber(e)}
                 onKeyDown={(e) => this.keydownEnter(e)}
                 placeholder="学籍番号"
                 className="Input InputUserNumberForm"
                 ref={this.userNumberForm}/>
        </p>
        <p className="InputFormWrapper">
          <input type={this.state.isShowPass}
                 onChange={(e) => this.changePassword(e)}
                 onKeyDown={(e) => this.keydownEnter(e, true)}
                 placeholder="パスワード"
                 className="Input InputUserPasswordForm"
                 ref={this.passwordForm}/>
          <button onClick={this.changeVisibilityPass} className="ChangeVisibilityPassButton">
            {this.state.isShowPass === "password" ?
              <FontAwesomeIcon icon={['far', 'eye-slash']} />
              :
              <FontAwesomeIcon icon={['far', 'eye']} />
            }
          </button>
        </p>
        <p>
          <button type="submit"
                  onClick={() => this.loginAdministration()}
                  className="Button">
            ログイン！
          </button>
        </p>
      </div>
    );
  }
}

export default withRouter(Login);