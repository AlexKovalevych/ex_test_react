import React, { PropTypes } from 'react';
import { Link, IndexLink, withRouter } from 'react-router';
import { connect } from 'react-redux';
import GtMenu from '../GtMenu';

let AppContainer = withRouter(class App extends React.Component {
    componentDidMount() {
        this.props.router.listen((route) => {
            const { isAuthenticated } = this.props;
            if (!isAuthenticated) {
                this.props.router.push('/login');
            } else if (route.pathname == '/login') {
                this.props.router.replace('/');
            }
        });
    }

    render() {
        const { isAuthenticated } = this.props;
        return (
            <div className="container">
                {
                    !isAuthenticated && (
                        <div className="row">
                            <div className="col-sm-offset-4 col-sm-4">
                                <IndexLink to="/">
                                    <img src="/images/logo.png" alt="logo" className="center-block" />
                                </IndexLink>
                            </div>
                            {this.props.children}
                        </div>
                    )
                }
                {
                    isAuthenticated && (
                        <div>
                        <nav className="navbar navbar-light bg-faded" style={{margin: '.5rem 1rem'}}>
                            <IndexLink to="/" className="navbar-brand">
                                Globotunes
                            </IndexLink>
                            <ul className="nav navbar-nav pull-xs-right">
                                <li className="nav-item">
                                    <Link to="/logout" className="nav-link">Logout</Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="col-sm-3">
                            <GtMenu />
                        </div>
                        </div>
                    )
                }
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
