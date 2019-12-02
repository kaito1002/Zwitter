import React from 'react';

import './Loading.scss'
import './AppIndex.scss'
import ZwitterLogo from './ZwitterLogo.svg';

import { withRouter, Link } from 'react-router-dom';

class AppIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoading: true,
    };
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (storedToken) {
      this.props.history.push('/Zwitter');
      this.setState({
        nowLoading: false,
      })
    } else {
      this.setState({
        nowLoading: false,
      })
    }
  }

  render() {
    return (
      <div className="AppIndex">
        {this.state.nowLoading ?
          <Spinner />
          :
          <div className="ZwitterDescriptionWrapper">
            <div className="ZwitterDescription">
              <img src={ZwitterLogo} alt="Zwitterのロゴです" className="ZwitterLogo0"/>
              <p className="ZweetDescriptionText Mobile">さあ、会津大学生だけのコミュニティで</p>
              <p className="ZweetDescriptionText Mobile">大学内情報を共有しよう</p>
              <p className="ZwitterDescriptionText PC">会津大学生専用のSNSです。</p>
              <p className="ZwitterDescriptionText PC">過去問と回答が共有できるサービスです。</p>
              <p className="ZwitterDescriptionText PC">出題問題の傾向を掴んで</p>
              <p className="ZwitterDescriptionText PC">効率よく勉強しましょう！</p>
              <p className="ButtonWrapper">
                <Link to="/CreateAccount" className="Button CreateUser">
                  無料ではじめる！
                </Link>
                <Link to="/Login" className="Button LoginUser">
                  ログイン
                </Link>
              </p>
            </div>
            <div className="ZwitterMockupList">
              <p>Mock1</p>
              <p>Mock2</p>
              <p>Mock3</p>
            </div>
          </div>
        }
      </div>
    );
  }
}

export function Spinner() {
  return <div className="loader">Now Loading...</div>;
}

export default withRouter(AppIndex);