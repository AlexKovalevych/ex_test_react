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
            <div id="container" className="container cls-container">
                <div className="row center-xs">
                    <IndexLink to="/" className="box-inline col-xs-6">
                        <img className="brand-icon" src="/images/logo.png" alt="logo" />
                        <span className="brand-title">GLOBO<span className="text-thin">tunes</span></span>
                    </IndexLink>
                </div>
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
