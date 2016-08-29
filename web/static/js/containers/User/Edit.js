import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import userActions from 'actions/user';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import Title from 'components/Title';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import { push } from 'react-router-redux';
import translate from 'counterpart';
import PermissionsLeftBlock from 'containers/Permissions/LeftBlock';
import PermissionsRightBlock from 'containers/Permissions/RightBlock';
import gtTheme from 'themes';
import passwordGenerator from 'managers/PasswordGenerator';

const styles = {
    backButton: {marginRight: 15},
    button: {margin: 20}
};

class UserEdit extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        errors: PropTypes.object,
        params: PropTypes.object,
        dispatch: PropTypes.func,
        permissions: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(JSON.stringify(props.data)),
            generatedPassword: false
        };
    }

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channels['admins'] && update) {
            dispatch(userActions.loadUser(this.props.params ? this.props.params.id : null));
        } else {
            dispatch(spinnerActions.stop());
        }
        if (!props.errors && props.data) {
            this.setState({user: JSON.parse(JSON.stringify(props.data))});
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    goToListPage() {
        const {dispatch} = this.props;
        dispatch(push('/settings/user/list'));
    }

    getTitle() {
        let crumb;
        if (this.props.data) {
            if (!this.props.data.id) {
                crumb = (<Translate content="user.new" />);
            } else {
                crumb = (<Translate content="user.edit" email={this.props.data.email} />) ;
            }
        }

        return (
            <Title>
                <FloatingActionButton secondary={true} mini={true} onClick={this.goToListPage.bind(this)} style={styles.backButton}>
                    <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </FloatingActionButton>
                {crumb}
            </Title>
        );
    }

    getError(field) {
        const {errors} = this.props;
        if (errors && errors[field]) {
            return (<Translate content={errors[field][0]} />);
        }
    }

    onChangeTextInput(field, e) {
        let newState = this.state;
        newState.user[field] = e.target.value;
        if (field == 'password_plain') {
            newState.generatedPassword = false;
        }
        this.setState(newState);
    }

    updateUser(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        let user = this.state.user;
        user.permissions = this.props.permissions;
        dispatch(userActions.updateUser(this.props.data.id, user));
    }

    onToggle(field, e) {
        let newState = this.state;
        newState.user[field] = e.target.checked;
        this.setState(newState);
    }

    onChangeSelect(field, e, key, value) {
        let newState = this.state;
        newState.user[field] = value;
        this.setState(newState);
    }

    generatePassword() {
        let newPassword = passwordGenerator.generate();
        let newState = this.state;
        newState.user.password_plain = newPassword;
        newState.generatedPassword = true;
        this.setState(newState);
    }

    render() {
        if (!this.state.user) {
            return (
                <div>
                    <div className="row">
                        {this.getTitle()}
                    </div>
                </div>
            );
        }

        let passwordPlain = this.state.user.password_plain ? this.state.user.password_plain : '';
        let passwordProps = {
            id: 'password',
            fullWidth: true,
            onChange: this.onChangeTextInput.bind(this, 'password_plain'),
            value: passwordPlain,
            errorText: this.getError('password_plain')
        };
        if (!this.state.generatedPassword) {
            passwordProps.type = 'password';
        }
        let passwordLabel;
        if (this.props.params.id) {
            passwordLabel = (<Translate content="user.new_password" />);
        } else {
            passwordLabel = (<Translate content="user.password" />);
        }

        passwordProps.hintText = passwordLabel;
        passwordProps.floatingLabelText = passwordLabel;

        return (
            <div>
                <div className="row">
                    {this.getTitle()}
                    <form className="row" style={{width: '100%'}} onSubmit={this.updateUser.bind(this)}>
                        <div className="col-lg-4 col-md-6 col-xs-12">
                            <TextField
                                id="email"
                                value={this.state.user.email ? this.state.user.email : ''}
                                hintText={<Translate content="user.email" />}
                                floatingLabelText={<Translate content="user.email" />}
                                fullWidth={true}
                                onChange={this.onChangeTextInput.bind(this, 'email')}
                                errorText={this.getError('email')}
                            />
                            <TextField {...passwordProps} />
                            <TextField
                                id="phoneNumber"
                                ref="phoneNumber"
                                value={this.state.user.securePhoneNumber ? this.state.user.securePhoneNumber : ''}
                                hintText={<Translate content="user.phone_number" />}
                                floatingLabelText={<Translate content="user.phone_number" />}
                                onChange={this.onChangeTextInput.bind(this, 'securePhoneNumber')}
                                errorText={this.getError('phoneNumber')}
                                fullWidth={true}
                            />
                            <TextField
                                id="description"
                                ref="description"
                                value={this.state.user.description ? this.state.user.description : ''}
                                hintText={<Translate content="user.comment" />}
                                floatingLabelText={<Translate content="user.comment" />}
                                fullWidth={true}
                                onChange={this.onChangeTextInput.bind(this, 'description')}
                            />
                            <Toggle
                                label={translate('user.enabled')}
                                toggled={this.state.user.enabled}
                                labelPosition="right"
                                onToggle={this.onToggle.bind(this, 'enabled')}
                            />
                            <Toggle
                                label={translate('user.notifications_enabled')}
                                toggled={this.state.user.notificationsEnabled}
                                labelPosition="right"
                                onToggle={this.onToggle.bind(this, 'notificationsEnabled')}
                            />
                            <Toggle
                                label={translate('user.is_admin')}
                                toggled={this.state.user.is_admin}
                                labelPosition="right"
                                onToggle={this.onToggle.bind(this, 'is_admin')}
                            />
                            <SelectField
                                id="authentication_type"
                                value={this.state.user.authenticationType}
                                floatingLabelText={<Translate content="user.authentication_type" />}
                                onChange={this.onChangeSelect.bind(this, 'authenticationType')}
                            >
                                <MenuItem value="none" primaryText={<Translate content="user.auth.none" />} style={gtTheme.theme.link} />
                                <MenuItem value="google" primaryText={<Translate content="user.auth.google" />} style={gtTheme.theme.link} />
                                <MenuItem value="sms" primaryText={<Translate content="user.auth.sms" />} style={gtTheme.theme.link} />
                            </SelectField>
                            <SelectField
                                id="locale"
                                value={this.state.user.locale}
                                floatingLabelText={<Translate content="user.locale" />}
                                onChange={this.onChangeSelect.bind(this, 'locale')}
                            >
                                <MenuItem value="ru" primaryText={<Translate content="ru" />} style={gtTheme.theme.link} />
                                <MenuItem value="en" primaryText={<Translate content="en" />} style={gtTheme.theme.link} />
                            </SelectField>
                        </div>
                        <div className="col-lg-2 col-md-3 col-xs-6">
                            <PermissionsLeftBlock />
                        </div>
                        <div className="col-lg-2 col-md-3 col-xs-6">
                            <PermissionsRightBlock />
                        </div>
                        <div className="col-xs-12 col-lg-12 col-md-12 center-xs">
                            <RaisedButton
                                type="submit"
                                label={<Translate content="form.save" />}
                                primary={true}
                                style={styles.button}
                            />
                            <RaisedButton
                                label={<Translate content="user.generate_password" />}
                                onClick={this.generatePassword.bind(this)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        data: state.users.user,
        errors: state.users.errors,
        permissions: state.permissions.users ? state.permissions.users[0].permissions : null,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserEdit);
