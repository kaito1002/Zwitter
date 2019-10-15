import React from "react";
import "./Exam.scss";

import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link
} from "react-router-dom";

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoading: false,
      selectSubjectName: undefined,
      selectSubjectPk: undefined,
      selectSubjectYears: undefined,
      selectSubjectLatestYear: undefined,
      searchWord: undefined,
      validationReload: true
    };
    this.setSelectSubject = this.setSelectSubject.bind(this);
    this.setSearchWord = this.setSearchWord.bind(this);
    this.setSearchResult = this.setSearchResult.bind(this);
  }

  setSelectSubject(subject) {
    // console.log(subject);
    this.setState({
      selectSubjectName: subject.name,
      selectSubjectPk: subject.id,
      selectSubjectYears: subject.years,
      selectSubjectLatestYear: subject.latest
    });
  }

  setSearchWord(searchWord) {
    this.setState({
      searchWord: searchWord
    });
  }

  setSearchResult() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    axios
      .get(`/api/subjects/search/?keyword=${this.state.searchWord}`, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        }
      })
      .then(Response => {
        console.log(Response.data);
        console.log(this.state.subjects);
        this.setState({
          subjects: Response.data,
          nowLoading: true
        });
      })
      .catch(err => {
        console.log(err);
      });
    console.log("redirect");
  }

  componentDidMount() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push("/");
    } else {
      // console.log(this.props.history.location.pathname)
      if (this.props.history.location.pathname === "/Exam") {
        axios
          .get("/api/subjects/user_related_exists", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response);
            this.setState({
              subjects: Response.data.subjects,
              nowLoading: true
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
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
          <span className="ExamContents">
            <div className="LeftSideMenu">
              <div className="LinkToZwitter">
                <Link to="/Zwitter">Zwitter</Link>
              </div>
            </div>
            <div className="MainContents">
              <Router basename="/Exam">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <SubjectsLists
                        subjects={this.state.subjects}
                        setSelectSubject={this.setSelectSubject}
                        setSearchWord={this.setSearchWord}
                        setSearchResult={this.setSearchResult}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={`/${this.state.selectSubjectName}/${this.state.selectSubjectLatestYear}`}
                    render={() => (
                      <ExamLists
                        subject={this.state.selectSubjectName}
                        pk={this.state.selectSubjectPk}
                        years={this.state.selectSubjectYears}
                        latestYear={this.state.selectSubjectLatestYear}
                      />
                    )}
                  />
                </Switch>
              </Router>
            </div>
            <div className="RightSideMenu">
              <p>RightSideMenu</p>
            </div>
          </span>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

class SubjectsLists extends React.Component {
  render() {
    return (
      <div className="SubjectLists">
        <div className="SearchSubjects">
          <p>
            <input
              type="text"
              onChange={e => this.props.setSearchWord(e.target.value)}
            ></input>
            <button onClick={() => this.props.setSearchResult()}>検索</button>
            {/* <Redirect to="/Zwitter" /> */}
          </p>
        </div>
        {this.props.subjects.map((subject, index) => (
          <p key={index} onClick={() => this.props.setSelectSubject(subject)}>
            <Link to={`/${subject.name}/${subject.latest}`}>
              {subject.latest === undefined
                ? `${subject.id}:${subject.name} <投稿が存在しません>`
                : `${subject.id}:${subject.name}`}
            </Link>
          </p>
        ))}
      </div>
    );
  }
}

class ExamLists extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exams: [],
      contents: [],
      nowLoading: false,
      nullExamsMessage: undefined
    };
  }

  componentDidMount() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push("/");
    } else {
      // 年度情報を読み込みたい
      axios
        .get(`/api/exams/?subject=${this.props.pk}`, {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          console.log(Response.data.results);
          this.setState({
            exams: Response.data.results
          });
          var latest = Response.data.results.filter(result => {
            return result.year === this.props.latestYear;
          });
          console.log(latest);
          // コンテンツを読み込みたい
          axios
            .get(`/api/contents/?exam=${latest[0].pk}`, {
              headers: {
                Authorization: `TOKEN ${storedToken}`
              }
            })
            .then(examResponse => {
              // console.log(examResponse.data.results)
              this.setState({
                contents: examResponse.data.results,
                nowLoading: true
              });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className="ExamLists">
        {this.state.nowLoading ? (
          <span>
            <h1>{this.props.subject}</h1>
            <h1>{this.state.nullExamsMessage}</h1>
            {this.state.contents.map((content, index) => (
              <div className={`Content ${index}`} key={index}>
                <p>{content.data}</p>
                <p>投稿日時:{content.posted_at}</p>
                <p>投稿者:{content.poster.name}</p>
                <p>学籍番号:{content.poster.number}</p>
              </div>
            ))}
            <hr />
            {this.props.years.map((year, index) => (
              <p key={index}>
                <Link to={`/${this.props.subject}/${year}`}>{year}</Link>
              </p>
            ))}
          </span>
        ) : (
          <Spinner />
        )}
      </div>
    );
  }
}

function Spinner() {
  return <div className="loader">Now Loading...</div>;
}

export default withRouter(Exam);
