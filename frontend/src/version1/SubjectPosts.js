import React from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';

export class SubjectPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    console.log(this.props.subjectName)
    axios
      .get(`/api/exams/?subject=${this.props.subjectPk}`)
      .then(Response => {
        console.log(Response)
        console.log(Response.data.results)
        this.setState({
          posts: Response.data.results
        })
      })
      .catch(err => {
        console.log(err)
      })
  }

  render() {
    return (
      <div className="SubjectPosts">
        <h1>
          {this.props.subjectPk}:{this.props.subjectName}
        </h1>
        {this.state.posts.map((post, index) =>
          <p key={index} onClick={() => this.props.setSelectSubjectYear(post.pk, post.year)}>
            <Link to={`/exam/${this.props.subjectName}/${post.year}`}>
              {post.subject.name}:{post.year}
            </Link>
          </p>
        )}
      </div>
    )
  }
}

export class SubjectPostsContents extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    // console.log(this.props.subjectName)
    axios
      .get(`/api/contents/?exam=${this.props.examPk}&poster=`)
      .then(Response => {
        console.log(Response)
        console.log(Response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    return (
      <div className="SubjectPostsContents">
        <h1>SubjectPostsContents!</h1>
      </div>
    )
  }
}
