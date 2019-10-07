import React from 'react';
import axios from 'axios';


class SubjectPosts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentDidMount() {
    console.log(this.props.subjectName)
    axios
      // * 本番用
      // * .get(`/api/exams/?subject=${this.props.subjectPk}`)
      .get(`/api/exams/?subject=92`)
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

    // TODO 以下のコメントアウトしてあるコードでどのような動作をするか木村に聞く
    // TODO 具体的にはSubjectsにuser_relatedが必要なのはわかるが、Examにはuser_relatedが必要か？と思ったから
    /*
    *axios
    *  .get(`/api/exams/?subject=92`, {
    *    headers: {
    *      Authorization: `TOKEN ${this.state.token}`
    *    }
    *  })
    *  .then(Response => {
    *    console.log(Response)
    *  })
    *  .catch(err => {
    *    console.log(err)
    *  })
    */
  }
  render() {
    return (
      <div className="SubjectPosts">
        <h1>
          {this.props.subjectPk}:{this.props.subjectName}
        </h1>
        {this.state.posts.map((post, index) =>
          <p key={index}>
            {post.subject.name}:{post.year}
          </p>
        )}
      </div>
    )
  }
}

export default SubjectPosts;