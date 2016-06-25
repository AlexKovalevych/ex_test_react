import React from 'react';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import { withRouter } from 'react-router';

let LoginComponent = withRouter(class Login extends React.Component {
    resetError() {
        this.props.dispatch({
            type: 'AUTH_LOGIN_ERROR',
            value: false
        });
    }

    componentWillMount() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            this.props.router.push('/');
        }
    }

    componentDidMount() {
        this.resetError();
    }

    render() {
        let error;
        if (this.props.loginFailed) {
            error = (
                <div className="alert alert-danger" role="alert">
                    {this.props.loginError}
                </div>
            );
        }

        return (
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
        );
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.refs;
        const { dispatch } = this.props;
        const params = {email: email.value, password: password.value};

        dispatch(authActions.login(params));
    }
});

const mapStateToProps = (state) => {
    return {
        loginFailed: state.auth.loginFailed,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(LoginComponent);
