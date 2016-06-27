import React, { PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import { connect } from 'react-redux';

class App extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object,
        menu: PropTypes.object,
        main: PropTypes.object,
        children: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.context.router.listen((route) => {
            const { isAuthenticated } = this.props;
            if (!isAuthenticated && route.pathname != '/login') {
                this.context.router.push('/login');
            } else if (isAuthenticated && route.pathname == '/login') {
                this.context.router.replace('/');
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
                                {this.props.menu}
                            </div>
                            <div className="col-sm-9">
                                {this.props.main}
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(App);
