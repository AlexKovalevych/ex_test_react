import React from 'react';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { withRouter } from 'react-router';

let LoginComponent = withRouter(class Login extends React.Component {
    componentWillMount() {
        const { isAuthenticated } = this.props;
        if (isAuthenticated) {
            this.props.router.push('/');
        }
    }

    componentDidMount() {
        // Clean up all previously set errors before rendering the element
        this.props.dispatch({
            type: 'AUTH_LOGIN_ERROR',
            value: false
        });
    }

    render() {
        // if (this.props.login_failed) {
        //     error = (
        //         <div className="form_errors">
        //             <ul>Invalid login or password</ul>
        //         </div>
        //     );
        // }

        return (
            <div className="container">
                <div className="row center-xs">
                    <div className="col-xs-6">
                        <Paper zDepth={2} style={{padding: '20px'}}>
                            <TextField
                                hintText="Email"
                                underlineShow={false}
                                fullWidth={true}
                                ref="email"
                            />
                            <Divider />
                            <TextField
                                type="password"
                                hintText="Password"
                                underlineShow={false}
                                fullWidth={true}
                                ref="password"
                            />
                            <Divider />
                                <div className="row center-xs">
                                    <RaisedButton
                                        label="Login"
                                        primary={true}
                                        onMouseUp={this.handleSubmit.bind(this)}
                                        style={{marginTop: '20px'}}
                                    />
                                </div>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }

    handleSubmit(e) {
        e.preventDefault();

        const { email, password } = this.refs;
        const { dispatch } = this.props;
        const params = {email: email.getValue(), password: password.getValue()};

        dispatch(authActions.login(params));
    }
});

const mapStateToProps = (state) => {
    return {
        loginFailed: state.auth.loginFailed,
        isAuthenticated: state.auth.isAuthenticated
    };
};

export default connect(mapStateToProps)(LoginComponent);
