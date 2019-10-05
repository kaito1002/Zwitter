import React from 'react';
import './Exam.css';
import SelectSubjects from './SelectSubjects.js'
import SubjectPosts from './SubjectPosts.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import axios from 'axios';

import { BrowserRouter as Router, Route } from 'react-router-dom';

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsName: null,
      subjectYear: null,
      subjectsPk: null,
    }
    this.setSubjectName = this.setSubjectName.bind(this);
    this.setSubjectYear = this.setSubjectYear.bind(this);
    this.setSubjectPk = this.setSubjectPk.bind(this);
  }

  setSubjectName(name) {
    this.setState({
      subjectsName: name
    })
  }

  setSubjectYear(year) {
    this.setState({
      subjectYear: year
    })
  }

  setSubjectPk(pk) {
    this.setState({
      subjectsPk: pk
    })
  }

  render() {
    return (
      <div className="Exam">
        <div className="ExamContents">
          <Router>
            <Route exact path="/exam" render={() =>
              <SelectSubjects
                setSubjectName={this.setSubjectName}
                setSubjectYear={this.setSubjectYear}
                setSubjectPk={this.setSubjectPk} />
            } />
            <Route path={`/exam/${this.state.subjectsName}/${this.state.subjectYear}`} render={() =>
              <SubjectPosts
                subjectsName={this.state.subjectsName}
                subjectsPk={this.state.subjectsPk} />}
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