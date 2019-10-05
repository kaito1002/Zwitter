import React from 'react';
import axios from 'axios';


class SubjectPosts extends React.Component {
  componentDidMount() {
    if (this.props.SubjectPosts === null) {
      console.log("ないよ")
    }
    console.log(this.props.subjectsPk)
    axios
      .get(`/api/contents/?exam=${this.props.subjectsPk}&poster=`)
      .then(response => {
        console.log(response.data.results)
      })
  }
  render() {
    return (
      <div className="SubjectPosts">
        <h1>{this.props.subjectsName}</h1>
        <h1>{this.props.subjectsPk}</h1>
      </div>
    )
  }
}

export default SubjectPosts;