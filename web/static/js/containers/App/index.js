import React, { PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import { Dropdown } from 'react-bootstrap';
import counterpart from 'counterpart';
// import Translate from 'react-translate-component';

class App extends React.Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        menu: PropTypes.object,
        main: PropTypes.object,
        children: PropTypes.object,
        dispatch: PropTypes.func
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

    setLocale(locale) {
        counterpart.setLocale(locale);
    }

    onLogout(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(authActions.logout());
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

                                    <Dropdown className="nav-item" componentClass="li">
                                        <Dropdown.Toggle className="nav-link" useAnchor>
                                            Language
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <a className="dropdown-item" href="#" onClick={this.setLocale.bind(this, 'ru')}>
                                                Russian
                                            </a>
                                            <a className="dropdown-item" href="#" onClick={this.setLocale.bind(this, 'en')}>
                                                English
                                            </a>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <li className="nav-item">
                                        <a onClick={this.onLogout.bind(this)} className="nav-link" href="#">Logout</a>
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
