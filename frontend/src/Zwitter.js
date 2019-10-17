import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { Spinner } from './AppIndex.js';
import AppIndex from './AppIndex.js';
import './Zwitter.scss';

Modal.setAppElement('#root');

class Zwitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoadiong: true,
      zweetList: undefined,
      replyList: undefined,
      zweetText: undefined,
    };
    this.changeZweetText = this.changeZweetText.bind(this);
    this.sendZweet = this.sendZweet.bind(this);
  }

  changeZweetText(zweetText) {
    this.setState({
      zweetText: zweetText,
    })
  }

  sendZweet() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    axios
      .post('api/posts', {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        },
        bef_post: null,
        content: this.state.zweetText,
      })
      .then(Response => {
        console.log(Response)
      })
      .catch(err => {
        console.log(err)
      })
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    } else {
      axios
        .get('api/posts', {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          // console.log(Response.data.results);
          var zweets = Response.data.results.filter(result => {
            return result.bef_post === null;
          })
          var replys = Response.data.results.filter(result => {
            return result.bef_post !== null;
          })
          this.setState({
            zweetList: zweets,
            replyList: replys,
            nowLoadiong: false,
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div className="Zwitter">
        {this.state.nowLoadiong ?
          <Spinner />
          :
          <span className="ZwitterContents">
            <div className="LeftSideMenu">
              <Link to="/Exam">Exam</Link>
            </div>
            <div className="MainContents">
              <Router basename="/Zwitter">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <span>
                        <div className="ZweetForm">
                          <textarea
                            defaultValue="いまなにしてる？"
                            onChange={(e) => this.changeZweetText(e.target.value)}></textarea>
                          <button type="submit" onClick={() => this.sendZweet()}>ヅイート！</button>
                        </div>
                        {this.state.zweetList.map((zweet, index) => {
                          var replys = this.state.replyList.filter(result => {
                            return result.bef_post === zweet.pk
                          })
                          return (
                            <span key={index}>
                              <ZweetContent
                                zweet={zweet}
                                replys={replys}
                              />
                            </span>
                          )
                        })}
                      </span>
                    )}
                  />
                  <Route
                    exact
                    path="/hogehoge"
                    render={() => (
                      <ZweetDetail />
                    )}
                  />
                  <Route Component={AppIndex} />
                </Switch>
              </Router>
            </div>
            <div className="RightSideMenu">
              hogehoge
            </div>
          </span>
        }
      </div>
    )
  }
}

class ZweetContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      showZweetReply: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.showZweetDetail = this.showZweetDetail.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true,
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    })
  }

  showZweetDetail() {
    this.setState({
      showZweetReply: !this.state.showZweetReply,
    })
  }

  render() {
    return (
      <div className="ZweetContent">
        <div>
          <p id="ZweetWrapper" onClick={() => this.showZweetDetail()}>
            {/* <span id="ZweetUserImage">image</span> */}
            <span id="ZweetUserName">{this.props.zweet.user.name}</span>
            <span id="ZweetContents">{this.props.zweet.content}</span>
          </p>
          {this.state.showZweetReply ?
            this.props.replys.map((reply, index) => {
              return (
                <p id="ReplyWrapper" key={index}>
                  {/* <span id="ZweetUserImage">image</span> */}
                  <span id="ZweetUserName">{reply.user.name}</span>
                  <span id="ZweetContents">{reply.content}</span>
                </p>
              )
            })
            :
            <span></span>
          }
          <button onClick={() => this.openModal()}>リプライ({this.props.replys.length})</button>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <p>
            <span id="ZweetUserImage">image</span>
            <span id="ZweetUserName">{this.props.zweet.user.name}</span>
            <span id="ZweetContents">{this.props.zweet.content}</span>
          </p>
          <textarea defaultValue="いまなにしてる？"></textarea>
          <button type="submit">ズイート！</button>
        </Modal>
      </div>
    )
  }
}

class ZweetDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowLoadiong: true,
    };
  }

  componentDidMount() {
    this.setState({
      nowLoadiong: false,
    })
  }

  render() {
    return (
      <div className="ZweetDetail">
        {this.nowLoadiong ?
          <Spinner />
          :
          <h1>This is ZweetDetail</h1>
        }
      </div>
    )
  }
}

export default withRouter(Zwitter);