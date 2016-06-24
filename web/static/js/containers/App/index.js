import React, { PropTypes } from 'react';
import { Link, IndexLink, withRouter } from 'react-router';
import { connect } from 'react-redux';

let AppContainer = withRouter(class App extends React.Component {
    componentWillMount() {
        const { isAuthenticated } = this.props;
        if (!isAuthenticated) {
            this.props.router.push('/auth/login');
        }
    }

    render() {

        return (
            <div className="container">
                <header className="header">
                    <nav role="navigation">
                        <ul className="nav nav-pills pull-right">
                            <li><Link className="btn" to="/auth/login">Login</Link></li>
                        </ul>
                    </nav>
                    <IndexLink to="/"><span className="logo"></span></IndexLink>
                </header>
                {this.props.children}
            </div>
        );
    }
});
AppContainer.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return state.auth;
};

let App = connect(mapStateToProps)(AppContainer);

export default App;
