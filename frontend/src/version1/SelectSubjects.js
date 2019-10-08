import React from 'react';

import axios from 'axios';

import { withRouter, Link } from 'react-router-dom';

class SelectSubjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      token: undefined,
    }
    this.setExamLink = this.setExamLink.bind(this);
  }

  setExamLink(subjectName, subjectPk) {
    this.props.setSelectSubjectName(subjectName);
    this.props.setSelectSubjectPk(subjectPk)
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (storedToken) {
      axios
        .get('/api/subjects/user_related/', {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(subjectsResponse => {
          // console.log(subjectsResponse)
          this.setState({
            token: storedToken,
            subjects: subjectsResponse.data
          })
        })
        .catch(err => {
          console.log(err);
        })
    };
  }

  render() {
    return (
      <div className="SelectSubjects">
        {this.state.subjects.map((subject, index) =>
          <p key={index} onClick={() => this.setExamLink(subject.name, subject.id)}>
            <Link to={`/exam/${subject.name}`}>
              {subject.id}:{subject.name}
            </Link>
          </p>
        )}
      </div>
    )
  }
}

export default withRouter(SelectSubjects);
