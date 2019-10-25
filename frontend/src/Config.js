import React from 'react';
import axios from 'axios';

import { withRouter } from 'react-router-dom';

class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.uploadImage = this.uploadImage.bind(this);
    this.fileInput = React.createRef();
  }

  uploadImage() {
    var file = this.fileInput.current.files[0];
    var formData = new FormData();
    formData.append("file", file);

    var storedToken = localStorage.getItem("storedToken");
    storedToken = JSON.parse(storedToken);

    axios
      .post('/api/users/img/', formData, {
        headers: {
          Authorization: `TOKEN ${storedToken}`,
          'content-type': 'multipart/form-data'
        }
      }).then(response => {
        // console.log(response);
        this.props.history.push("/Zwitter");
      }).catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="Config">
        <h1>This is Config page</h1>
        <input ref={this.fileInput} type="file" />
        <button onClick={() => this.uploadImage()}>アップロード</button>
      </div>
    );
  }
}

export default withRouter(Config);
