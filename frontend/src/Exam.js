import React from 'react';
import './Exam.css';

import axios from 'axios';
import { HashRouter, Switch, withRouter, Route, Link } from 'react-router-dom';

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoading: false,
      selectSubjectName: undefined,
      selectSubjectPk: undefined,
      validationReload: true,
    }
    this.setSelectSubject = this.setSelectSubject.bind(this);
  }

  setSelectSubject(subjectName, subjectPk) {
    this.setState({
      selectSubjectName: subjectName,
      selectSubjectPk: subjectPk,
    })
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    } else {
      // console.log(this.props.history.location.pathname)
      if (this.props.history.location.pathname === "/Exam") {
        axios
          .get('/api/subjects/user_related/', {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            // console.log(Response)
            this.setState({
              subjects: Response.data,
              nowLoading: true,
            })
          })
          .catch(err => {
            console.log(err);
          })
      }
    };
  }

  UNSAFE_componentWillMount() {
    // console.log(this.props.history.location)
    if (this.props.history.location.pathname !== "/Exam") {
      this.props.history.push(`/Exam`);
    }
  }

  render() {
    return (
      <div className="Exam">
        {this.state.nowLoading ? (
          <span>
            <HashRouter basename="/Exam">
              <Switch>
                <Route exact path="/" render={() =>
                  <SubjectsLists
                    subjects={this.state.subjects}
                    setSelectSubject={this.setSelectSubject} />
                } />
                <Route exact path={`/${this.state.selectSubjectName}`} render={() =>
                  <ExamLists
                    subject={this.state.selectSubjectName}
                    pk={this.state.selectSubjectPk} />
                } />
                {/* <Route component={Exam} /> */}
              </Switch>
            </HashRouter>
            <div className="LinkToZwitter">
              <Link to="/Zwitter">Zwitter</Link>
            </div>
          </span>
        ) : (
            <Spinner />
          )
        }
      </div>
    )
  }
}

class SubjectsLists extends React.Component {
  render() {
    return (
      <div className="SubjectLists">
        {this.props.subjects.map((subject, index) =>
          <p key={index} onClick={() => this.props.setSelectSubject(subject.name, subject.id)}>
            <Link to={`/${subject.name}`}>
              {subject.id}:{subject.name}
            </Link>
          </p>
        )}
      </div>
    )
  }
}

class ExamLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: [],
      contents: [],
      nowLoading: false,
      nullExamsMessage: undefined,
    }
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    } else {
      // 年度情報を読み込みたい
      axios
        .get(`/api/exams/?subject=${this.props.pk}`, {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          console.log(Response)
          if (Response.data.results.length !== 0) {
            this.setState({
              exams: Response.data.results,
            })
          } else {
            this.setState({
              exams: [],
              nullExamsMessage: 'まだ何も投稿がありません',
              nowLoading: true,
            })
          }
        })
        .catch(err => {
          console.log(err);
        })

      // コンテンツを読み込みたい
      axios
        .get(`/api/contents/?exam=11&poster=`, {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          console.log(Response.data.results)
          this.setState({
            contents: Response.data.results,
            nowLoading: true,
          })
        })
        .catch(err => {
          console.log(err);
        })

    }
  };

  render() {
    return (
      <div className="ExamLists">
        {this.state.nowLoading ? (
          <span>
            <h1>{this.props.subject}</h1>
            <h1>{this.state.nullExamsMessage}</h1>
            {this.state.contents.map((content, index) =>
              <div className={`Content${index}`} key={index}>
                <p>{content.data}</p>
                <p>投稿日時:{content.posted_at}</p>
                <p>投稿者:{content.poster.name}</p>
                <p>学籍番号:{content.poster.number}</p>
              </div>
            )}
            <hr />
            {this.state.exams.map((exam, index) =>
              <p key={index}>
                <Link to={`/${this.props.subject}/${exam.year}`}>
                  {exam.year}
                </Link>
              </p>
            )}
          </span>
        ) : (
            <Spinner />
          )
        }
      </div>
    )
  }
}

function Spinner() {
  return (
    <div className="loader">Now Loading...</div>
  )
}

export default withRouter(Exam);