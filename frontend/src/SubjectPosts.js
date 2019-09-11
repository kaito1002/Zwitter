import React from 'react';

class SubjectPosts extends React.Component {
    render() {
        return (
            <div className="SubjectPosts">
                <h1>{this.props.subjectsName}</h1>
            </div>
        )
    }
}

export default SubjectPosts;