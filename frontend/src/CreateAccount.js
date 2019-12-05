import React from 'react';
import axios from 'axios';
import {
  withRouter,
  Link
} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './CreateAccount.scss';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      number: undefined,
      pass: undefined,
      isShowPass: "password"
    };
    this.changeName = this.changeName.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.changePass = this.changePass.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.changeVisibilityPass = this.changeVisibilityPass.bind(this);

    this.fileInput = React.createRef();
  }

  changeName(name) {
    this.setState({
      name: name
    })
  }

  changeNumber(number) {
    this.setState({
      number: number,
    })
  }

  changePass(pass){
    this.setState({
      pass: pass,
    })
  }

  createAccount() {
    axios
      .post('/api/users/', {
        "name": this.state.name,
        "number": this.state.number,
        "password": this.state.pass,
      })
      .then(Response => {
        console.log(Response.data)
      })
      .catch(error => {
        console.log(error);
      });

    axios
      .post('/api-token-auth/', {
        "username": this.state.number,
        "password": this.state.pass,
      })
      .then(response => {
        console.log(response.data.token);
        this.updateLocalStorage(response.data.token, 'storedToken');

        var file = this.fileInput.current.files[0];
        var formData = new FormData();
        formData.append("file", file);

        axios
          .post('/api/users/img/', formData, {
            headers: {
              Authorization: `TOKEN ${response.data.token}`,
              'content-type': 'multipart/form-data'
            }
          }).then(response => {
          this.props.history.push("/Zwitter");
        }).catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      });
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

  updateLocalStorage(data, name) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  render() {
    return (
      <div className="CreateAccount">
        <Link to="/">
          <FontAwesomeIcon className="BackButton" icon={['fas', 'arrow-left']}/>
        </Link>
        <h1 className="CardTitle">Create Account</h1>
        <p className="InputFormWrapper">
          <input type="text"
                 onChange={(e) => this.changeName(e.target.value)}
                 placeholder="名前"
                 className="Input"/>
        </p>
        <p className="InputFormWrapper">
          <input type="text"
                 onChange={(e) => this.changeNumber(e.target.value)}
                 placeholder="学籍番号"
                 className="Input"/>
        </p>
        <p className="InputFormWrapper">
          <input type={this.state.isShowPass}
                 onChange={(e) => this.changePass(e.target.value)}
                 placeholder="パスワード"
                 className="Input"/>
          <button onClick={this.changeVisibilityPass} className="ChangeVisibilityPassButton">
            {this.state.isShowPass === "password" ?
              <FontAwesomeIcon icon={['far', 'eye-slash']} />
              :
              <FontAwesomeIcon icon={['far', 'eye']} />
            }
          </button>
        </p>
        <p className="InputFormWrapper">
          プロフィール画像<input ref={this.fileInput} type="file" />
        </p>
        <p className="InputFormWrapper">
          <button onClick={() => this.createAccount()} className="CreateAccountButton">アカウントを作成！</button>
        </p>
      </div>
    )
  }
}

export default withRouter(CreateAccount);
