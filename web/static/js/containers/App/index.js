import React, { PropTypes } from 'react';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import { Dropdown } from 'react-bootstrap';
import counterpart from 'counterpart';
// import Translate from 'react-translate-component';

class App extends React.Component {
    static propTypes = {
        menu: PropTypes.object,
        main: PropTypes.object,
        children: PropTypes.object,
        dispatch: PropTypes.func,
        currentUser: PropTypes.object,
        socket: PropTypes.object,
        channel: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
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
        return (
            <div className="container-fluid">
                <div className="row">
                    <nav className="navbar navbar-full navbar-light bg-faded">
                        <IndexLink to="/" className="navbar-brand">
                            Globotunes
                        </IndexLink>
                        <ul className="nav navbar-nav pull-xs-right">
                            <Dropdown className="nav-item" componentClass="li" id="locale">
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
                        <div className="row">{this.props.menu}</div>
                    </div>
                    <div className="col-sm-9">
                        {this.props.main}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentUser: state.auth.currentUser,
    socket: state.auth.socket,
    channel: state.auth.channel
});

export default connect(mapStateToProps)(App);
