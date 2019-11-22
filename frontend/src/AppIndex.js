import React from 'react';
import './Loading.scss'

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
          <span>
            <h1>Zwitter</h1>
            <p>会津大学の学生専用のSNSです</p>
            <p>過去問と回答の共有ができます！</p>
            <p>
              <Link to="/Login">
                Login page
            </Link>
            </p>
            <p>
              <Link to="/CreateAccount">
                Create Account
            </Link>
            </p>
          </span>
        }
      </div>
    );
  }
}

export function Spinner() {
  return <div className="loader">Now Loading...</div>;
}

export default withRouter(AppIndex);