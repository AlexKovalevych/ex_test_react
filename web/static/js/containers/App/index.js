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
        const { isAuthenticated } = this.props;
        return (
            <div id="container" className="container cls-container">
                {
                    !isAuthenticated && (
                        <div className="row center-xs">
                            <IndexLink to="/" className="col-xs-6">
                                <img src="/images/logo.png" alt="logo" />
                            </IndexLink>
                        </div>
                    )
                }
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
