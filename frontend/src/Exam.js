import React from 'react';
import './Exam.css';
import SelectSubjects from './SelectSubjects.js'
// import SubjectPosts from './SubjectPosts.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import axios from 'axios';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import SubjectPosts from './SubjectPosts';

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectSubjectName: undefined,
      selectSubjectPk: undefined,
    }
    this.setSelectSubjectName = this.setSelectSubjectName.bind(this);
    this.setSelectSubjectPk = this.setSelectSubjectPk.bind(this);
  }

  setSelectSubjectName(subjectName) {
    this.setState({
      selectSubjectName: subjectName,
    })
  }

  setSelectSubjectPk(subjectPk) {
    this.setState({
      selectSubjectPk: subjectPk
    })
  }

  render() {
    return (
      <div className="Exam">
        <div className="ExamContents">
          <Router>
            <Route exact path="/exam" render={() =>
              <SelectSubjects
                setSelectSubjectName={this.setSelectSubjectName}
                setSelectSubjectPk={this.setSelectSubjectPk}
              />}
            />
            <Route path={`/exam/${this.state.selectSubjectName}`} render={() =>
              <SubjectPosts
                subjectName={this.state.selectSubjectName}
                subjectPk={this.state.selectSubjectPk}
              />}
            />
          </Router>
        </div>
        <div className="RightsideBar">
          <FontAwesomeIcon icon={['fas', 'cog']} size="5x" />
        </div>
      </div>
    )
  }
}

export default Exam;