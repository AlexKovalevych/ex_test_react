import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import authActions from 'actions/auth';
import { IndexLink } from 'react-router';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

const styles = {
    paper: {
        padding: '0 20px'
    },
    form: {
        textAlign: 'center'
    }
};

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
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

    componentDidMount() {
        this.resetError();
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.refs;
        const { dispatch } = this.props;
        const params = {email: email.input.value, password: password.input.value};

        dispatch(authActions.login(params));
    }

    render() {
        let error;
        if (this.props.error) {
            error = (<Translate content={this.props.error} />);
        }
        counterpart.setLocale('ru');

        return (
            <div className="row">
                <div className="col-xs-offset-4 col-xs-4" style={styles.form}>
                    <IndexLink to="/">
                        <img src="/images/logo.png" alt="logo" />
                    </IndexLink>
                    <Paper zDepth={2} style={styles.paper}>
                        <TextField
                            hintText={<Translate content="form.email" />}
                            ref="email"
                            id="email"
                            underlineShow={false}
                            fullWidth={true}
                            errorText={error}
                        />
                        <Divider />
                        <TextField
                            type="password"
                            ref="password"
                            id="password"
                            hintText={<Translate content="form.password" />}
                            underlineShow={false}
                            fullWidth={true}
                        />
                        <Divider />
                        <div>
                            <RaisedButton
                                label={<Translate content="form.login" />}
                                primary={true}
                                style={{
                                    margin: '20px'
                                }}
                                onMouseUp={this.onSubmit.bind(this)}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(Login);
