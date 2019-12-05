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
import { FontAwesomeIcon }from '@fortawesome/react-fontawesome'
import Modal from 'react-modal';

Modal.setAppElement('#root');

class Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoading: true,
      subjects: undefined,
      allSubjects: undefined,
      allExams: undefined,
      allContents: undefined,
      allComments: undefined,
      //SelectSubjects
      searchSubjectsText: "",
      searchSubjectsResults: undefined,
      isSearch: false,
      //PostContents
      postContentText: "",
      postSelectSubject: undefined,
      postSubjectYear: undefined,
      postContentType: undefined,
      //ShowExam
      commentText: "",
      commentPk: undefined,
      replyPk: undefined,
      modalIsOpen: false,
    };
    this.getStoredToken = this.getStoredToken.bind(this);
    //SelectSubjects
    this.changeSearchSubjectsText = this.changeSearchSubjectsText.bind(this);
    this.searchSubjects = this.searchSubjects.bind(this);
    this.backToSelectSubjects = this.backToSelectSubjects.bind(this);
    //PostContents
    this.changePostContentText = this.changePostContentText.bind(this);
    this.changePostSubject = this.changePostSubject.bind(this);
    //ShowExam
    this.changeCommentText = this.changeCommentText.bind(this);
    this.sendComment = this.sendComment.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeReplyText = this.changeReplyText.bind(this);
    this.sendReply = this.sendReply.bind(this);
    //RenderMethods
    this.SelectSubject = this.SelectSubject.bind(this);
    this.ShowExam = this.ShowExam.bind(this);
    this.ShowComment = this.ShowComment.bind(this);
  }

  getStoredToken(){
    let result = localStorage.getItem("storedToken");
    result = JSON.parse(result);
    return result;
  }

  changeSearchSubjectsText(subjectsText){
    this.setState({
      searchSubjectsText: subjectsText,
    })
  }

  searchSubjects() {
    let storedToken = this.getStoredToken();
    axios
      .get(`/api/subjects/search_v2/?keyword=${this.state.searchSubjectsText}`, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        }
      })
      .then(Response => {
        this.setState({
          searchSubjectsResults: Response.data,
          isSearch: true,
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  backToSelectSubjects(){
    this.setState({
      searchSubjectsResults: undefined,
      isSearch: false,
    })
  }

  //PostContentMethods
  changePostContentText(postContentText){
    this.setState({
      postContentText: postContentText,
    });
  }

  changePostSubject(selectPostSubject) {
    if (selectPostSubject === "---") {
      this.setState({
        selectPostSubject: undefined,
      });
    } else {
      this.setState({
        selectPostSubject: parseInt(selectPostSubject, 10),
      })
    }
  }

  changePostSubjectYear(postSubjectYear) {
    this.setState({
      postSubjectYear: parseInt(postSubjectYear, 10),
    });
  }

  changePostContentType(postContentType) {
    this.setState({
      postContentType: parseInt(postContentType, 10),
    })
  }

  postContent() {
    const params = Querystring.stringify({
      "subject": this.state.selectSubject,
      "year": this.state.subjectYear,
      "type": this.state.contentType,
      "data": this.state.contentText,
    }, { arrayFormat: 'bracket' });

    let storedToken = this.getStoredToken();
    axios
      .post(`/api/contents/`, params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`,
        },
      })
      .then((Response) => {
        if(Response.data.success){
          console.log(Response);
          window.alert("投稿が完了しました");
          this.props.history.goBack();
        }else{
          window.alert("値が不正です");
        }
      })
      .catch((err) => {
        window.alert("値が不正です");
        console.log(err);
      });
  }

  //ShowExam
  changeCommentText(commentText) {
    this.setState({
      commentText: commentText
    });
  }

  sendComment() {
    if(this.state.commentText === "") {
      window.alert("何か入力してください！");
    }else{
      let storedToken = this.getStoredToken();

      let exam = this.state.exams.find((result) => {
        return result.year === this.props.year
      });

      const params = Querystring.stringify({
        "exam": parseInt(exam.pk, 10),
        "data": this.state.commentText,
        "bef_comment": -1,
      }, { arrayFormat: 'bracket'});

      axios
        .post("/api/comments/", params, {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          },
        })
        .then(Response => {
          console.log(Response)
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  openModal(pk, reopen=false){
    reopen ?
      this.setState({
        commentPk: pk,
        replyPk: pk,
        modalIsOpen: true,
      })
      :
      this.setState({
        commentPk: pk,
        modalIsOpen: true,
      })
  }

  closeModal(){
    this.setState({
      commentPk: undefined,
      replyPk: undefined,
      modalIsOpen: false,
    })
  }

  changeReplyText(replyText){
    this.setState({
      replyText: replyText,
    })
  }

  sendReply(exam){
    let storedToken = this.getStoredToken();

    const params = Querystring.stringify({
      "exam": parseInt(exam.pk, 10),
      "data": this.state.replyText,
      "bef_comment": this.state.commentPk,
    }, { arrayFormat: 'bracket'});

    axios
      .post("/api/comments/", params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        },
      })
      .then(Response => {
        axios
          .get(`/api/comments/?exam=${this.state.latest.pk}`, {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            this.setState({
              comments: Response.data,
            })
          })
          .catch(err => {
            console.log(err);
          });
        console.log(Response)
      })
      .catch(err => {
        console.log(err);
      });
  }

  //RenderMethods
  SelectSubject(){
    return(
      <div className="SelectSubject">
        <div className="SearchSubjects">
          <p>
            <input
              type="text"
              onChange={e => this.changeSearchSubjectsText(e.target.value)} />
            <button onClick={() => this.searchSubjects()}>検索</button>
          </p>
        </div>
        <Link to={`/post`}>コンテンツを投稿する</Link>
        <div className="SubjectLists">
          {this.state.isSearch ? (
            <div>
              <FontAwesomeIcon className="BackButton" icon={['fas', 'arrow-left']} onClick={() => this.backToSelectSubjects()}/>
              {this.state.searchSubjectsResults.map((subject, index) => (
                <p key={index}>
                  {subject.latest === null ?
                    <Link to={`/${subject.name}/undefined`}>{subject.id}:{subject.name} - 投稿が存在しません</Link>
                    :
                    <Link to={`/${subject.name}/${subject.latest}`}>{subject.id}:{subject.name}</Link>
                  }
                </p>
              ))}
            </div>
            ):(
            <div>
              {this.state.subjects.map((subject, index) => (
                <p key={index}>
                  {subject.latest === null ?
                    <Link to={`/${subject.name}/undefined`}>{subject.id}:{subject.name} - 投稿が存在しません</Link>
                    :
                    <Link to={`/${subject.name}/${subject.latest}`}>{subject.id}:{subject.name}</Link>
                  }
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  PostContent(subject=false){
    if(subject){
      this.setState({
        selectPostSubject: parseInt(subject.pk, 10),
      })
    }
    return(
      <div className="PostContent">
        <h1>ContentsPost</h1>
        <div className="Subject">
          教科:
          {subject ?
            <p>
              {subject.name}
            </p>
            :
            <p>
              <select name="subjectText" onChange={(e) => this.changePostSubject(e.target.value)}>
                <option value="---">---</option>
                {this.state.allSubjects.map((subject, index) =>
                  <option value={subject.pk} key={index}>{subject.name}</option>
                )}
              </select>
            </p>
          }
        </div>
        <div className="Year">
          年度:
          <input type="number" onChange={(e) => this.changePostSubjectYear(e.target.value)} />
        </div>
        <div className="Type">
          種類:
          <select value={this.contentType} onChange={(e) => this.changePostContentType(e.target.value)}>
            <option value="-1">---</option>
            <option value="0">問題</option>
            <option value="1">回答</option>
            <option value="2">その他</option>
          </select>
        </div>
        <div className="Content">
          内容:
          <textarea value={this.state.contentText} onChange={(e) => this.changePostContentText(e.target.value)}/>
        </div>
        <div className="hogehoge">
            <button type="submit" onClick={() => this.postContent()}>
              投稿！
            </button>
        </div>
      </div>
    )
  }

  ShowExam(subject, existExam=true, exam=false){
    return(
      <div className="ExamLists">
        <h1>{subject.name}</h1>
        {existExam ?
          <div>
            <div className="ContentsList">
              {this.state.allContents.map((content, index) => {
                if (content.exam.pk === exam.pk) {
                  return (
                    <div className={`Content ${index}`} key={index}>
                      <p>{content.data}</p>
                      <p>投稿日時:{content.posted_at}</p>
                      <p>投稿者:{content.poster.name}</p>
                      <p>学籍番号:{content.poster.number}</p>
                    </div>
                  )
                }else{
                  return null;
                }
              })}
              <hr/>
            </div>
            <div className="CommentList">
              {this.state.allComments.map((comment, index) => {
                if (comment.exam.pk === exam.pk) {
                  return (
                    comment.bef_comment === null ?
                      <div key={index}>
                        {this.ShowComment(comment)}
                        {comment.pk === this.state.commentPk ?
                          <Modal
                            isOpen={this.state.modalIsOpen}
                            onRequestClose={this.closeModal}
                          >
                            {this.ShowComment(comment, true)}
                            <div className="CommentReplyList">
                              {this.state.allComments.map((reply, index_nest) => {
                                return (
                                  <div key={index_nest}>
                                    {reply.bef_comment === comment.pk ?
                                      this.ShowComment(reply, false, true)
                                      :
                                      null
                                    }
                                  </div>
                                )
                              })}
                            </div>
                          </Modal>
                          :
                          null
                        }
                      </div>
                      :
                      comment.pk === this.state.replyPk ?
                        <Modal
                          isOpen={this.state.modalIsOpen}
                          onRequestClose={this.closeModal}
                          key={index}
                        >
                          {this.ShowComment(comment, true)}
                          <div className="CommentReplyList">
                            {this.state.allComments.map((reply, index_nest) => {
                              return (
                                <div key={index_nest}>
                                  {reply.bef_comment === comment.pk ?
                                    this.ShowComment(reply, false, true)
                                    :
                                    null
                                  }
                                </div>
                              )
                            })}
                          </div>
                        </Modal>
                        :
                        null
                  )
                }else{
                  return null;
                }
              })}
            </div>
            <div className="CommentForm">
              <input
                type="text"
                onChange={e => this.changeCommentText(e.target.value)}
              />
              <button type="submit" onClick={() => this.sendComment()}>
                コメントを投稿
              </button>
            </div>
            <div className="YearsList">
              {this.state.allExams.map((exam, index) => {
                if(subject.pk === exam.subject.pk){
                  return(
                    <p key={index}>
                      <Link to={`/${subject.name}/${exam.year}`}>{exam.year}</Link>
                    </p>
                  )
                }else{
                  return null;
                }
              })}
            </div>
          </div>
          :
          <div>
            <h1>投稿が存在しません</h1>
          </div>
        }
        <Link to={`/${subject.name}/post`}>
          <button>コンテンツを投稿！</button>
        </Link>
      </div>
    )
  }

  ShowComment(comment, reply=false, reopen=false){
    return(
      <div className="CommentContent">
        {reply ?
          <FontAwesomeIcon className="BackButton" icon={['fas', 'arrow-left']} onClick={() => this.closeModal()} />
          :
          null
        }
        <span className="UserImage"><img src={`${comment.sender.image_path}`}
                                         alt={`${comment.sender.name}のユーザー画像`}/></span>
        <span className="UserName">{comment.sender.name}</span>
        <span className="CommentText">{comment.data}</span>
        {reply ?
          <p>
            <input type="text" onChange={(e) => this.changeReplyText(e.target.value)} placeholder="コメントを入力" />
            <button type="submit" onClick={() => this.sendReply()}>コメントを返信</button>
          </p>
          :
          reopen ?
            <span className="ButtonList">
              <button className="ReplyButton Button" onClick={() => this.openModal(comment.pk, true)}>
                <FontAwesomeIcon icon={['far', 'comment-dots']}/>
              </button>
            </span>
            :
            <span className="ButtonList">
              <button className="ReplyButton Button" onClick={() => this.openModal(comment.pk)}>
                <FontAwesomeIcon icon={['far', 'comment-dots']}/>
              </button>
            </span>
        }
        <hr />
      </div>
    )
  }

  componentDidMount() {
    let storedToken = this.getStoredToken();
    if (!storedToken) {
      this.props.history.push("/");
    } else {
      if (this.props.history.location.pathname === "/exam") {
        axios
          .get("/api/subjects", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            this.setState({
              allSubjects: Response.data,
            })
          })
          .catch(error => {
            console.log(error)
          });

        axios
          .get("/api/subjects/user_related_exists", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            this.setState({
              subjects: Response.data.subjects,
            });
          })
          .catch(error => {
            console.log(error);
          });

        axios
          .get("/api/exams", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            this.setState({
              allExams: Response.data,
            });
          })
          .catch(error => {
            console.log(error);
          });

        axios
          .get("/api/contents", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            this.setState({
              allContents: Response.data,
            });
          })
          .catch(error => {
            console.log(error);
          });

        axios
          .get("/api/comments", {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            this.setState({
              allComments: Response.data,
              nowLoading: false,
            });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }

  UNSAFE_componentWillMount() {
    if (this.props.history.location.pathname !== "/exam") {
      this.props.history.push(`/exam`);
    }
  }

  render() {
    return (
      <div className="Exam">
        {this.state.nowLoading ?
          <Spinner />
          :
          <div className="ExamContents">
            <div className="LeftSideMenu">
              <div className="LinkToZwitter">
                <button className="Button">
                  <Link to="/Zwitter">Zwitter</Link>
                </button>
              </div>
            </div>
            <div className="MainContents">
              <Router basename="/exam">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      this.SelectSubject()
                    )}
                  />
                  {this.state.allSubjects.map((subject) =>
                    this.state.allExams.map((exam, indexNest) => {
                      if(subject.pk === exam.subject.pk) {
                        return(
                          <Route
                            key={indexNest}
                            exact
                            path={`/${subject.name}/${exam.year}`}
                            render={() => (
                              this.ShowExam(subject, true, exam)
                            )}
                          />
                        )
                      }else{
                        return null;
                      }}
                    )
                  )}
                  {this.state.allSubjects.map((subject, index) =>
                    <Route
                      key={index}
                      exact
                      path={`/${subject.name}/post`}
                      render={() => (
                        this.PostContent(subject)
                      )}
                    />
                  )}
                  {this.state.allSubjects.map((subject, index) =>
                    <Route
                      key={index}
                      exact
                      path={`/${subject.name}/undefined`}
                      render={() => (
                        this.ShowExam(subject, false)
                      )}
                    />
                  )}
                  <Route
                    exact
                    path="/post"
                    render={() => (
                      this.PostContent()
                    )}
                  />
                  <Route Component={AppIndex} />
                </Switch>
              </Router>
            </div>
            <div className="RightSideMenu">
            </div>
          </div>
          }
      </div>
    );
  }
}
export default withRouter(Exam);
