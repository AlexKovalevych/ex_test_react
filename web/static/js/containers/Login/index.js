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
    input: {
        paddingLeft: 20
    },
    form: {
        width: '33%',
        margin: '0 auto',
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

    render() {
        let error;
        if (this.props.error) {
            error = (<Translate content={this.props.error} />);
        }
        counterpart.setLocale('ru');
        return (
            <div style={styles.form}>
                <IndexLink to="/">
                    <img src="/images/logo.png" alt="logo" />
                </IndexLink>
                <Paper zDepth={2}>
                    <TextField
                        hintText={<Translate content="form.email" />}
                        ref="email"
                        id="email"
                        style={styles.input}
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
                        style={styles.input}
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
        );
    }

    onSubmit(e) {
        e.preventDefault();
        const { email, password } = this.refs;
        const { dispatch } = this.props;
        const params = {email: email.input.value, password: password.input.value};

        dispatch(authActions.login(params));
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(Login);
