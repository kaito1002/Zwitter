import React from 'react';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      number: undefined,
      mail: undefined,
      password: undefined,
      path: undefined,
    }
    this.changeName = this.changeName.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    // this.changePass = this.changePass.bind(this);
    // this.changePath = this.changePath.bind(this);
    this.createAccount = this.createAccount.bind(this);
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

  createAccount() {
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
          パスワード<input type="password" />
        </p>
        <p>
          プロフィール画像<input id="file" type="file" />
        </p>
        <p>
          <button onClick={() => this.createAccount()}>アカウントを作成！</button>
        </p>
      </div>
    )
  }
}

export default CreateAccount;
