import React from 'react';
import axios from 'axios';
import Querystring from 'query-string'
import { withRouter } from 'react-router-dom';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      number: undefined,
      pass: undefined,
    };
    this.changeName = this.changeName.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.changePass = this.changePass.bind(this);
    this.createAccount = this.createAccount.bind(this);

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
    // axios
    //   .post('/api/users/', {
    //     "name": this.state.name,
    //     "number": this.state.number,
    //     "password": this.state.pass,
    //   })
    //   .then(Response => {
    //     console.log(Response.data)
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // let params = Querystring.stringify({
    //   "username": this.state.name,
    //   "password": this.state.pass,
    // }, {arrayFormat: 'bracket'});
    //
    // console.log(params);

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

  updateLocalStorage(data, name) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  render() {
    return (
      <div className="CreateAccount">
        <h1>Create Account</h1>
        <p>
          名前<input type="text" onChange={(e) => this.changeName(e.target.value)} />
        </p>
        <p>
          学籍番号<input type="text" onChange={(e) => this.changeNumber(e.target.value)} />
        </p>
        <p>
          パスワード<input type="password" onChange={(e) => this.changePass(e.target.value)} />
        </p>
        <p>
          プロフィール画像<input ref={this.fileInput} type="file" />
        </p>
        <p>
          <button onClick={() => this.createAccount()}>アカウントを作成！</button>
        </p>
      </div>
    )
  }
}

export default withRouter(CreateAccount);
