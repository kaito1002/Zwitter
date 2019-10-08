import React from 'react';

import { Link } from 'react-router-dom';

class AppIndex extends React.Component {
    componentDidMount() {
        var storedToken = localStorage.getItem('storedToken');
        storedToken = JSON.parse(storedToken);
        if (storedToken) {
            this.props.history.push('/Zwitter');
        }
    }

    render() {
        return (
            <div className="AppIndex">
                <h1>App Index</h1>
                <Link to="/Login">
                    <p>Login page</p>
                </Link>
            </div>
        );
    }
}

export default AppIndex;