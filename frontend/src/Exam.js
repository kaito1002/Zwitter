import React from 'react';
import './Exam.css';

import axios from 'axios';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectsName: null,
      subjectYear: null,
    }
    this.setSubjectName = this.setSubjectName.bind(this);
    this.setSubjectYear = this.setSubjectYear.bind(this);
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

  render() {
    return (
      <div className="Exam">
        <div className="ExamContents">
          <Router>
            <Route exact path="/exam" render={() => <SelectSubjects setSubjectName={this.setSubjectName} setSubjectYear={this.setSubjectYear} />} />
            <Route path={`/exam/${this.state.subjectsName}/${this.state.subjectYear}`} render={() => <SubjectPosts subjectsName={this.state.subjectsName} />} />
          </Router>
        </div>
        <div className="RightsideBar">
          Config
        </div>
      </div>
    )
  }
}

export default Exam;

class SelectSubjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      subjectYear: null,
    }
    this.decideSubjectsAndYear = this.decideSubjectsAndYear.bind(this);
  }

  decideSubjectsAndYear(name, year) {
    this.props.setSubjectName(name);
    this.props.setSubjectYear(year);
  }

  componentDidMount() {
    axios
      .get('/api/subjects')
      .then(subjectsResponse => {
        let subjects = [];
        for (let i = 0; i < subjectsResponse.data.results.length; i++) {
          subjects.push(subjectsResponse.data.results[i])

          // 最新の年情報をうまいこと会得する
          axios
            .get('/api/exams')
            .then(examResponse => {
              let years = [];
              for (let j = 0; j < examResponse.data.results.length; j++) {
                if (examResponse.data.results[j].subject.name === subjectsResponse.data.results[i].name) {
                  years.push(examResponse.data.results[i].year)
                }
              }
              let year = Math.max.apply(null, years);
              // console.log(subjectsResponse.data.results[i].name + " " + year)
              if (year !== Infinity) {
                this.props.setSubjectYear(year);
                this.setState({
                  subjectYear: year
                })
                subjects[i]["year"] = year;
              } else {
                console.log("ERROR!")
              }

            })
            .catch(err => {
              console.log(err)
            })

        }
        this.setState({
          subjects: subjects
        })
        console.log(subjects)
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div className="SelectSubjects">
        {this.state.subjects.map((subject, index) =>
          <p key={index}>
            <Link to={`/exam/${subject.name}/${subject.year}`} onClick={() => this.decideSubjectsAndYear(subject.name, subject.year)}>
              {subject.name}
            </Link>
          </p>
        )}
      </div>
    )
  }
}

class SubjectPosts extends React.Component {
  render() {
    return (
      <div className="SubjectPosts">
        <h1>{this.props.subjectsName}</h1>
      </div>
    )
  }
}