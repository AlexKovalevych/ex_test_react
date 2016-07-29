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
    button: {
        margin: '20px'
    },
    paper: {
        padding: '0 20px'
    },
    form: {
        textAlign: 'center'
    }
};

class Login extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        dispatch: PropTypes.func,
        error: PropTypes.string
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {code: null};
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

    onTwoFactorSubmit(e) {
        e.preventDefault();
        const { twoFactor } = this.refs;
        const { dispatch } = this.props;
        dispatch(authActions.twoFactor(twoFactor.input.value));
    }

    onChangeCode(e) {
        this.setState({code: e.target.value});
    }

    render() {
        let error;
        if (this.props.error) {
            error = (<Translate content={this.props.error} />);
        }
        counterpart.setLocale('ru');

        let form;
        if (this.props.user) {
            switch (this.props.user.authenticationType) {
            case 'sms':
                form = ([
                    <div style={{padding: 16}} key="message">
                        <Translate content="login.sms_sent" phone={this.props.user.phoneNumber} />
                    </div>,
                    <Divider key="divider" />,
                    <TextField
                        key="smsInput"
                        hintText={<Translate content="form.sms_code" />}
                        floatingLabelText={<Translate content="form.sms_code" />}
                        ref="twoFactor"
                        id="twoFactor"
                        underlineShow={false}
                        fullWidth={true}
                        errorText={error}
                    />,
                    <div key="actions">
                        <RaisedButton
                            label={<Translate content="form.login" />}
                            primary={true}
                            style={styles.button}
                            onMouseUp={this.onTwoFactorSubmit.bind(this)}
                        />
                    </div>
                ]);
                break;
            case 'google':
                form = ([
                    <TextField
                        key="googleInput"
                        defaultValue=""
                        value={this.state.code}
                        onChange={this.onChangeCode.bind(this)}
                        hintText={<Translate content="form.google_code" />}
                        ref="twoFactor"
                        id="twoFactor"
                        underlineShow={false}
                        fullWidth={true}
                        errorText={error}
                    />,
                    <div key="actions">
                        <RaisedButton
                            label={<Translate content="form.login" />}
                            primary={true}
                            style={styles.button}
                            onMouseUp={this.onTwoFactorSubmit.bind(this)}
                        />
                    </div>
                ]);
                break;
            }
        } else {
            form = ([
                <TextField
                    key="login"
                    hintText={<Translate content="form.email" />}
                    ref="email"
                    id="email"
                    underlineShow={false}
                    fullWidth={true}
                    errorText={error}
                />,
                <Divider key="divider1" />,
                <TextField
                    key="password"
                    type="password"
                    ref="password"
                    id="password"
                    hintText={<Translate content="form.password" />}
                    underlineShow={false}
                    fullWidth={true}
                />,
                <Divider key="divider2" />,
                <div key="actions">
                    <RaisedButton
                        label={<Translate content="form.login" />}
                        primary={true}
                        style={styles.button}
                        onMouseUp={this.onSubmit.bind(this)}
                    />
                </div>
            ]);
        }

        return (
            <div className="row">
                <div className="col-xs-offset-4 col-xs-4" style={styles.form}>
                    <IndexLink to="/">
                        <img src="/images/logo.png" alt="logo" />
                    </IndexLink>
                    <Paper zDepth={2} style={styles.paper}>{form}</Paper>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(Login);
