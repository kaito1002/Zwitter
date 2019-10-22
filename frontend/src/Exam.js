import React from "react";
import "./Exam.scss";
import { Spinner } from './AppIndex.js'
import AppIndex from './AppIndex.js'

import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  Link
} from "react-router-dom";
import Querystring from 'query-string';

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
        // console.log(Response.data);
        // console.log(this.state.subjects);
        this.setState({
          subjects: Response.data,
          nowLoading: true
        });
      })
      .catch(err => {
        console.log(err);
      });
    // console.log("redirect");
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
            // console.log(Response);
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
                  <Route
                    exact
                    path={`/${this.state.selectSubjectName}/undifined`}
                    render={() => (
                      <ExamLists
                        subject={this.state.selectSubjectName}
                        pk={this.state.selectSubjectPk}
                        years={this.state.selectSubjectYears}
                        latestYear={this.state.selectSubjectLatestYear}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={`/Post`}
                    render={() =>
                      <ContentsPost />
                    }
                  />
                  <Route Component={AppIndex} />
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
          </p>
        </div>
        <Link to={`/Post`}>コンテンツを投稿する</Link>
        {this.props.subjects.map((subject, index) => (
          <p key={index} onClick={() => this.props.setSelectSubject(subject)}>
            <Link to={`/${subject.name}/${subject.latest}`}>
              {subject.latest === undefined
                ? `${subject.id}:${subject.name} 投稿が存在しません`
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
      nowLoading: true,
      commentText: undefined,
      latestPk: undefined,
      existContents: true,
    };
    this.changeCommentText = this.changeCommentText.bind(this);
    this.sendComment = this.sendComment.bind(this);
  }

  changeCommentText(commentText) {
    this.setState({
      commentText: commentText
    });
  }

  sendComment() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);

    axios
      .get("/api/users/10/", {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        }
      })
      .then(Response => {
        // console.log(this.state.exams[0])
        // console.log(nowTime)
        // console.log(Response.data)
        axios
          .post("/api/comments", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            },
            exam: this.state.exams[0],
            sender: Response.data,
            bef_comment: null,
          })
          .then(Response => {
            console.log("OK!");
            console.log(Response)
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
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
          // console.log(Response.data.results);
          this.setState({
            exams: Response.data.results
          });

          if (this.props.years === undefined || this.props.latestYear === undefined) {
            this.setState({
              existContents: false,
              nowLoading: false,
            })
          } else {
            var latest = Response.data.results.filter(result => {
              return result.year === this.props.latestYear;
            });
            this.setState({
              latestPk: latest,
            })
            // console.log(latest);
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
                  nowLoading: false
                });
              })
              .catch(err => {
                console.log(err);
              });

            // コメントを読み込みたい
            // axios
            //   .get(`/api/comments/?exam=${latest[0].pk}`, {
            //     headers: {
            //       Authorization: `TOKEN ${storedToken}`
            //     }
            //   })
            //   .then(Response => {
            //     console.log(Response);
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className="ExamLists">
        {this.state.nowLoading ?
          <Spinner />
          :
          this.state.existContents ?
            < span >
              <h1>{this.props.subject}</h1>
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
              <div className="CommentForm">
                <input
                  type="text"
                  onChange={e => this.changeCommentText(e.target.value)}
                />
                <button type="submit" onClick={() => this.sendComment()}>
                  コメントを投稿
              </button>
              </div>
            </span>
            :
            < span >
              <h1>{this.props.subject}</h1>
              <h1>投稿が存在しません</h1>
              <hr />
              <div className="CommentForm">
              </div>
            </span>
        }
      </div>
    );
  }
}

class ContentsPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoading: true,
      subjectsLists: undefined,
      selectSubject: undefined,
      validSubject: true,
      nowYear: undefined,
      validYear: true,
      contentType: undefined,
    };
    this.subjectText = React.createRef();
    this.changeSubject = this.changeSubject.bind(this);
    this.changeSubjectYear = this.changeSubjectYear.bind(this);
    this.changeContentType = this.changeContentType.bind(this);
    this.postContent = this.postContent.bind(this);
  }

  changeSubject(selectSubject) {
    if (selectSubject === "---") {
      this.setState({
        selectSubject: undefined,
        validSubject: false,
      });
    } else {
      this.setState({
        selectSubject: parseInt(selectSubject, 10),
        validSubject: true,
      });
    }
  }

  changeSubjectYear(subjectYear) {
    if (subjectYear >= this.state.nowYear - 10 && subjectYear <= this.state.nowYear) {
      this.setState({
        subjectYear: parseInt(subjectYear, 10),
        validYear: true,
      });
    } else {
      this.setState({
        validYear: false,
      })
    }
  }

  changeContentType(contentType) {
    this.setState({
      contentType: parseInt(contentType, 10),
    })
  }

  postContent() {
    const params = Querystring.stringify({
      "subject": this.state.selectSubject,
      "year": this.state.subjectYear,
      "type": this.state.contentType,
      "data": "ほげほげテスト用のdataですほげほげ",
    }, { arrayFormat: 'bracket' });
    // console.log(params);
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    // Subject(pk), year, type, data
    // var params = new URLSearchParams();
    // params.append('subject', this.state.selectSubject);
    // params.append('year', this.state.subjectYear);
    // params.append('type', this.state.contentType);
    // params.append('data', "ほげほげテスト用のdataですほげほげ");
    axios
      .post(`/api/contents/`, params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`,
        },
      })
      .then((Response) => {
        console.log(Response);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  componentDidMount() {
    var date = new Date();
    this.setState({
      nowYear: date.getFullYear(),
    })

    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push("/");
    } else {
      axios
        .get(`/api/subjects`, {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          // console.log(Response.data.results)
          this.setState({
            subjectsLists: Response.data.results,
            nowLoading: false,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  render() {
    return (
      <div className="ContentsPost" >
        {this.state.nowLoading ?
          <Spinner />
          :
          <span>
            <h1>ContentsPost</h1>
            <p>
              教科
              <select name="subjectText" onChange={(e) => this.changeSubject(e.target.value)}>
                <option value="---">---</option>
                {this.state.subjectsLists.map((subject, index) =>
                  <option value={subject.pk} key={index}>{subject.name}</option>
                )}
              </select>
              {this.state.validSubject ?
                <span></span>
                :
                <span>教科を選択してください</span>}
            </p>
            <p>年度
              <input type="number" onChange={(e) => this.changeSubjectYear(e.target.value)} />
              {this.state.validYear ?
                <span></span>
                :
                <span>{this.state.nowYear - 10}～{this.state.nowYear}年度の問題のみ投稿可能です！</span>
              }
            </p>
            <p>
              種類
              <select value={this.contentType} onChange={(e) => this.changeContentType(e.target.value)}>
                <option value="-1">---</option>
                <option value="0">問題</option>
                <option value="1">回答</option>
                <option value="2">その他</option>
              </select>
            </p>
            <p>
              内容
              <textarea />
            </p>
            <p>
              <button type="submit" onClick={() => this.postContent()}>投稿！</button>
            </p>
          </span>
        }
      </div>
    )
  }
}

export default withRouter(Exam);
