import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import { IndexLink } from 'react-router';

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        // isAuthenticated: PropTypes.bool,
        // loginFailed: PropTypes.bool,
        error: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    resetError() {
        this.props.dispatch({
            type: 'AUTH_LOGIN_ERROR',
            value: false
        });
    }

    // componentWillMount() {
    //     const { isAuthenticated } = this.props;
    //     if (isAuthenticated) {
    //         this.context.router.push('/');
    //     }
    // }

    componentDidMount() {
        this.resetError();
    }

    render() {
        let error;
        if (this.props.error) {
            error = (
                <div className="alert alert-danger" role="alert">
                    {this.props.error}
                </div>
            );
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-offset-4 col-sm-4">
                        <IndexLink to="/">
                            <img src="/images/logo.png" alt="logo" className="center-block" />
                        </IndexLink>
                    </div>
                    <form onSubmit={this.onSubmit.bind(this)} className="col-sm-offset-3 col-sm-6">
                        {error}
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Email"
                                ref="email"
                                onFocus={this.resetError.bind(this)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                ref="password"
                                onFocus={this.resetError.bind(this)}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary center-block">LOGIN</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.refs;
        const { dispatch } = this.props;
        const params = {email: email.value, password: password.value};

        dispatch(authActions.login(params));
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(Login);
