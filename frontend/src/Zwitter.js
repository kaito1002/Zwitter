import React from 'react';

import { withRouter, Link } from 'react-router-dom';

class Zwitter extends React.Component {
  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    };
  }

  render() {
    return (
      <div className="Zwitter">
        <h1>This is Zwitter Home</h1>
        <Link to="/Exam">Exam</Link>
      </div>
    )
  }
}

export default withRouter(Zwitter);