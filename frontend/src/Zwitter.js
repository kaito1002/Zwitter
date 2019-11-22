import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link,
} from 'react-router-dom';
import Querystring from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      user: undefined,
      nowLoadiong: true,
      zweetList: [],
      replyList: [],
      likeList: [],
      zweet: undefined,
      zweetText: "",
      zweetPk: 0,
      modalIsOpen: false,
      replyPk: 0,
      replyText: "",
      imagePath: "",
      likeCount: {},
      replyCount: {},
    };
    this.changeZweetText = this.changeZweetText.bind(this);
    this.sendZweet = this.sendZweet.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.changeReplyText = this.changeReplyText.bind(this);
    this.sendReply = this.sendReply.bind(this);
    this.backToZweetTop = this.backToZweetTop.bind(this);
    this.likeZweet = this.likeZweet.bind(this);
    this.checkExistLiked = this.checkExistLiked.bind(this);

    this.TimeLine = this.TimeLine.bind(this);
    this.ZweetDetail = this.ZweetDetail.bind(this);
    this.ReplyModal = this.ReplyModal.bind(this);
    this.ShowZweet = this.ShowZweet.bind(this);
    this.ButtonList = this.ButtonList.bind(this);
  }

  changeZweetText(zweetText) {
    this.setState({
      zweetText: zweetText,
    })
  }

  sendZweet() {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    const params = Querystring.stringify({
      "bef_post": -1,
      "content": this.state.zweetText,
    }, { arrayFormat: 'bracket' });
    axios
      .post('/api/posts/', params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        }
      })
      .then(Response => {
        console.log(Response)
        this.backToZweetTop();
      })
      .catch(err => {
        console.log(err)
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

  sendReply(zweet) {
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    const params = Querystring.stringify({
      "bef_post": zweet.pk,
      "content": this.state.replyText,
    }, { arrayFormat: 'bracket' });
    axios
      .post('/api/posts/', params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        },
      })
      .then(Response => {
        this.backToZweetTop();
      })
      .catch(err => {
        console.log(err)
      })
  }

  backToZweetTop(){
    this.props.history.push("/Zwitter");
  }

  likeZweet(pk){
    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);
    let params = Querystring.stringify({
      "post": parseInt(pk, 10),
    }, { arrayFormat: 'bracket' });

    axios
      .post('/api/likes/', params, {
        headers: {
          Authorization: `TOKEN ${storedToken}`
        }
      },)
      .then(Response => {
        if(!Response.data.success){
          let target = this.state.likeList.find(result => {
            return result.post.pk === pk;
          });
          axios
            .delete(`/api/likes/${target.pk}`, {
              headers: {
                Authorization: `TOKEN ${storedToken}`
              }
            })
            .then(Response => {
              console.log(Response.data);
            })
            .catch(error => {
              console.log(error)
            });
        }
        axios
          .get('/api/likes/',{
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            let likeList = Response.data.map((result) => {
              return result.post.pk;
            });
            let likeCount = {};
            for(var i = 0; i < likeList.length; i++){
              if(likeList.indexOf(likeList[i]) === i ){
                if(isNaN(likeCount[String(likeList[i])])){
                  likeCount[String(likeList[i])] = 0;
                }
                likeCount[String(likeList[i])] += 1;
              }
            }
            this.setState({
              likeList: Response.data,
              likeCount: likeCount,
            });
            console.log("DONE");
          })
          .catch(err => {
            console.log(err);
          });

      })
      .catch(error => {
        console.log(error);
      });
  }

  checkExistLiked(pk){
    let result = this.state.likeList.find(result => {
      return result.post.pk === pk && result.user.pk === this.state.user.pk;
    });
    console.log(pk + " " + result);
    if(result === undefined){
      return false;
    }else{
      return true
    }
  }

  TimeLine() {
    return (
      <span>
        <div className="ZweetForm">
          <textarea
            placeholder="いまなにしてる？"
            onChange={(e) => this.changeZweetText(e.target.value)} />
          <button type="submit" onClick={() => this.sendZweet()}>ヅイート！</button>
        </div>
        {this.state.zweetList.map((zweet, index) => {
          return (
            zweet.bef_post === null ?
              <span key={index}>
                {this.ShowZweet(zweet)}
                {this.ButtonList(zweet)}
              </span>
              :
              <span key={index}/>
          )
        })}
      </span>
    )
  }

  ButtonList(zweet){
    return(
      <div className="ButtonList">
        <p>
          <button className="ReplyButton Button" onClick={() => this.openModal(zweet.pk)}>
            <FontAwesomeIcon icon={['far', 'comment-dots']} />
            {isNaN(this.state.replyCount[zweet.pk]) ?
              0
              :
              this.state.replyCount[zweet.pk]
            }
          </button>
          <button className="LikeButton Button" onClick={() => this.likeZweet(zweet.pk)}>
            <FontAwesomeIcon icon={['far', 'heart']} className={[this.checkExistLiked(zweet.pk) ? 'Liked' : 'Unliked'].join(' ')}/>
            {isNaN(this.state.likeCount[zweet.pk]) ?
              0
              :
              this.state.likeCount[zweet.pk]
            }
          </button>
          <button className="ShareButton Button">
            <FontAwesomeIcon icon={['fas', 'retweet']} />
          </button>
        </p>
        {this.ReplyModal(zweet)}
        <hr />
      </div>
    )
  }

  ZweetDetail(pk) {
    let zweet = this.state.zweetList.find((result) => {
      return result.pk === pk;
    });
    let replys = this.state.zweetList.filter((result) => {
      return result.bef_post === pk;
    });
    return (
      <div className="ZweetDetail">
        <Link to="/">
          <FontAwesomeIcon className="BackButton" icon={['fas', 'arrow-left']}/>
        </Link>
        <span>
          {this.ShowZweet(zweet)}
          {this.ButtonList(zweet)}
        </span>
        {replys === [] ?
          <span/>
          :
          <span>
            {replys.map((reply, index) => {
              return (
                <span key={index}>
                  {this.ShowZweet(reply)}
                  {this.ButtonList(reply)}
                </span>
              )
            })}
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
          {this.ShowZweet(zweet, true)}
          <textarea placeholder="リプライの文章を入力" onChange={(e) => this.changeReplyText(e.target.value)}></textarea>
          <button type="submit" onClick={() => this.sendReply(zweet)}>リプライ！</button>
        </Modal>
        :
        null
    )
  }

  ShowZweet(zweet, useToModal=false){
    return(
      useToModal ?
        <p className="ZweetContent">
          <span className="UserImage"><img src={`${zweet.user.image_path}`} alt={`${zweet.user.name}のユーザー画像`}/></span>
          <span className="UserName">{zweet.user.name}</span>
          <span className="ContentText">{zweet.content}</span>
        </p>
        :
        <p className="ZweetContent">
          <Link to={`/${zweet.pk}`}>
            <span className="UserImage"><img src={`${zweet.user.image_path}`} alt={`${zweet.user.name}のユーザー画像`}/></span>
            <span className="UserName">{zweet.user.name}</span>
            <span className="ContentText">{zweet.content}</span>
          </Link>
        </p>
    )
  }

  componentDidMount() {
    var storedToken = localStorage.getItem('storedToken');
    storedToken = JSON.parse(storedToken);
    if (!storedToken) {
      this.props.history.push('/');
    } else {
      if (this.props.history.location.pathname === '/Zwitter') {
        axios
          .get('/api/users/me/', {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          }).then(Response => {
          this.setState({
            user: Response.data,
          })
        }).catch(err => {
          console.log(err);
        });

        axios
          .get('api/posts/', {
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            let replyList = Response.data.map((result) => {
              return result.bef_post;
            });
            let replyCount = {};
            for(var i = 0; i < replyList.length; i++){
              if(replyList.indexOf(replyList[i]) === i ){
                if(isNaN(replyCount[String(replyList[i])])){
                  replyCount[String(replyList[i])] = 1;
                }
                replyCount[String(replyList[i])] += 1;
              }
            }
            this.setState({
              zweetList: Response.data,
              nowLoadiong: false,
              replyCount: replyCount,
            })
          })
          .catch(err => {
            console.log(err);
          });

        axios
          .get('api/likes/',{
            headers: {
              Authorization: `TOKEN ${storedToken}`
            }
          })
          .then(Response => {
            console.log(Response.data);
            let likeList = Response.data.map((result) => {
              return result.post.pk;
            });
            let likeCount = {};
            for(var i = 0; i < likeList.length; i++){
              if(likeList.indexOf(likeList[i]) === i){
                if(isNaN(likeCount[String(likeList[i])])){
                  likeCount[String(likeList[i])] = 0;
                }
                likeCount[String(likeList[i])] += 1;
              }
            }
            console.log(likeCount);
            this.setState({
              likeList: Response.data,
              likeCount: likeCount,
            })
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  UNSAFE_componentWillMount() {
    if (this.props.history.location.pathname !== "/Zwitter") {
      this.props.history.push(`/Zwitter`);
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
                  {this.state.zweetList.map((zweet, index) =>
                    <Route
                      key={index}
                      exact
                      path={`/${zweet.pk}`}
                      render={() => this.ZweetDetail(zweet.pk)}
                    />
                  )}
                  <Route Component={AppIndex} />
                </Switch>
              </Router>
            </div>
            <div className="RightSideMenu">
              <p><img className="UserImage" src={`${this.state.user.image_path}`} alt="UserImage" /></p>
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