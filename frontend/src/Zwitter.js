import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
} from 'react-router-dom';
// import Querystring from 'query-string';
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
      zweet: undefined,
      zweetText: undefined,
      zweetPk: undefined,
      modalIsOpen: false,
      replyPk: undefined,
      replyText: undefined,
      imagePath: undefined,
    };
    this.changeZweetText = this.changeZweetText.bind(this);
    this.sendZweet = this.sendZweet.bind(this);
    this.setZweetDetail = this.setZweetDetail.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeReplyText = this.changeReplyText.bind(this);
    this.sendReply = this.sendReply.bind(this);

    this.TimeLine = this.TimeLine.bind(this);
    this.ZweetDetail = this.ZweetDetail.bind(this);
    this.ReplyModal = this.ReplyModal.bind(this);
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

  setZweetDetail(pk) {
    var zweet = this.state.zweetList.find((result) => {
      return result.pk === pk;
    })
    var replyList = this.state.zweetList.filter((result) => {
      return result.bef_post === pk;
    })
    this.setState({
      zweet: zweet,
      replyList: replyList,
      zweetPk: pk,
    })
  }

  openModal(pk) {
    this.setState({
      replyPk: pk,
      modalIsOpen: true,
    })
  }

  closeModal() {
    this.setState({
      replyPk: undefined,
      modalIsOpen: false,
    })
  }

  changeReplyText(replyText) {
    this.setState({
      replyText: replyText,
    })
  }

  sendReply() {
    console.log(this.state.replyText)
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    // const params = Querystring.stringfy({
    // });
    axios
      .post('api/posts', {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        },
        bef_post: this.state.replyPk,
        content: this.state.replyText,
      })
      .then(Response => {
        console.log(Response)
      })
      .catch(err => {
        console.log(err)
      })

  }

  TimeLine() {
    return (
      <span>
        <div className="ZweetForm">
          <textarea
            defaultValue="いまなにしてる？"
            onChange={(e) => this.changeZweetText(e.target.value)}></textarea>
          <button type="submit" onClick={() => this.sendZweet()}>ヅイート！</button>
        </div>
        {this.state.zweetList.map((zweet, index) => {
          return (
            zweet.bef_post === null ?
              <span key={index}>
                <p className="ZweetContent" onClick={() => this.setZweetDetail(zweet.pk)}>
                  <Link to={`/${zweet.pk}`}
                    id="ZweetWrapper">
                    <span id="UserName">{zweet.user.name}</span>
                    <span id="Content">{zweet.content}</span>
                  </Link>
                </p>
                <button onClick={() => this.openModal(zweet.pk)}>リプライ！</button>
                {this.ReplyModal(zweet)}
              </span>
              :
              <span key={index}></span>
          )
        })}
      </span>
    )
  }

  ZweetDetail() {
    return (
      <div className="ZweetDetail">
        {this.nowLoadiong ?
          <Spinner />
          :
          <span>
            <span>
              <p className="ZweetContent">
                <span id="UserName">{this.state.zweet.user.name}</span>
                <span id="Content">{this.state.zweet.content}</span>
              </p>
              <button onClick={() => this.openModal(this.state.zweet.pk)}>リプライ！</button>
              {this.ReplyModal(this.state.zweet)}
            </span>
            {this.state.replys === [] ?
              <span></span>
              :
              <span>
                {this.state.replyList.map((reply, index) => {
                  return (
                    <span key={index}>
                      <p className="ZweetContent" onClick={() => this.setZweetDetail(reply.pk)} >
                        <Link to={`/${reply.pk}`}>
                          <span id="UserName">{reply.user.name}</span>
                          <span id="Content">{reply.content}</span>
                        </Link>
                      </p>
                      <button onClick={() => this.openModal(reply.pk)}>リプライ！</button>
                      {this.ReplyModal(reply)}
                    </span>
                  )
                })}
              </span>
            }
          </span>
        }
      </div>
    )
  }

  ReplyModal(zweet) {
    return (
      zweet.pk === this.state.replyPk ?
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <p className="ZweetContent">
            <span id="UserName">{zweet.user.name}</span>
            <span id="Content">{zweet.content}</span>
          </p>
          <textarea defaultValue="いまなにしてる？" onChange={(e) => this.changeReplyText(e.target.value)}></textarea>
          <button type="submit" onClick={() => this.sendReply()}>リプライ！</button>
        </Modal>
        :
        null
    )
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    } else {
      axios
        .get('/api/users/me', {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        }).then(Response => {
          this.setState({
            imagePath: Response.data.image_path,
          })
        }).catch(err => {
          console.log(err);
        })

      axios
        .get('api/posts', {
          headers: {
            Authorization: `TOKEN ${storedToken}`
          }
        })
        .then(Response => {
          // console.log(Response.data);
          var zweets = Response.data;
          this.setState({
            zweetList: zweets,
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
                      this.TimeLine()
                    )}
                  />
                  <Route
                    exact
                    path={`/${this.state.zweetPk}`}
                    render={() => (
                      this.ZweetDetail()
                    )
                    }
                  />
                  <Route Component={AppIndex} />
                </Switch>
              </Router>
            </div>
            <div className="RightSideMenu">
              <p><img className="UserImage" src={`${this.state.imagePath}`} alt="UserImage" /></p>
              <p>
                <Link to="/Config">
                  Setting
                </Link>
              </p>
            </div>
          </span>
        }
      </div>
    )
  }
}

export default withRouter(Zwitter);