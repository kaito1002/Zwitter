import React from 'react';
import './Zwitter.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BrowserRouter as Router, Link } from 'react-router-dom';

class Zwitter extends React.Component {
  render() {
    return (
      <div className="Zwitter">
        <div className="ZwitterContents">
          <h1>This is Zwitter.</h1>
        </div>
        <div className="RightsideBar">
          <FontAwesomeIcon icon={['fas', 'cog']} size="5x" className="configIcon" />
        </div>
      </div>
    )
  }
}

export default Zwitter;