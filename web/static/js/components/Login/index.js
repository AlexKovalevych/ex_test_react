import React from 'react';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';


class Login extends React.Component {
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

        const style = {
            paddingLeft: 20
        };

        return (
            <div className="container">
                <div className="row center-xs">
                    <div className="col-xs-6">
                        <Paper zDepth={2}>
                            <TextField
                                hintText="Login"
                                style={style}
                                underlineShow={false}
                                fullWidth={true}
                            />
                            <Divider />
                            <TextField
                                type="password"
                                hintText="Password"
                                style={style}
                                underlineShow={false}
                                fullWidth={true}
                            />
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
        const params = {email: email.value, password: password.value};

        dispatch(authActions.login(params));
    }
}

const mapStateToProps = (state) => {
    return {
        login_failed: state.auth.login_failed
    };
};

export default connect(mapStateToProps)(Login);
