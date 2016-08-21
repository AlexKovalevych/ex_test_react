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

const styles = {
    backButton: {marginRight: 15},
    button: {margin: 20}
};

class UserEdit extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        errors: PropTypes.object,
        params: PropTypes.object,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            generatedPassword: false
        };
    }

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channel && update) {
            dispatch(userActions.loadUser(this.props.params ? this.props.params.id : null));
        } else {
            dispatch(spinnerActions.stop());
        }
        if (!props.errors && props.data) {
            this.setState({user: props.data});
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
        let user = this.state.user;
        user[field] = e.target.value;
        this.setState({user});
    }

    updateUser(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch(userActions.updateUser(this.props.data.id, this.state.user));
    }

    render() {
        let passwordProps = {
            id: 'password',
            ref: 'password',
            fullWidth: true
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
                    {this.state.user && (
                        <form className="row" style={{width: '100%'}} onSubmit={this.updateUser.bind(this)}>
                            <div className="col-lg-4 col-md-6 col-xs-12">
                                <TextField
                                    id="email"
                                    ref="email"
                                    value={this.state.user.email}
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
                                    value={this.state.user.securePhoneNumber}
                                    hintText={<Translate content="user.phone_number" />}
                                    floatingLabelText={<Translate content="user.phone_number" />}
                                    onChange={this.onChangeTextInput.bind(this, 'securePhoneNumber')}
                                    errorText={this.getError('phone_number')}
                                    fullWidth={true}
                                />
                                <TextField
                                    id="comment"
                                    ref="comment"
                                    value={this.state.user.comment}
                                    hintText={<Translate content="user.comment" />}
                                    floatingLabelText={<Translate content="user.comment" />}
                                    fullWidth={true}
                                />
                                <Toggle
                                    label={translate('user.enabled')}
                                    toggled={this.state.user.enabled}
                                    labelPosition="right"
                                />
                                <Toggle
                                    label={translate('user.notifications_enabled')}
                                    toggled={this.state.user.notificationsEnabled}
                                    labelPosition="right"
                                />
                                <Toggle
                                    label={translate('user.is_admin')}
                                    toggled={this.state.user.is_admin}
                                    labelPosition="right"
                                />
                                <SelectField
                                    id="authentication_type"
                                    value={this.state.user.authenticationType}
                                    floatingLabelText={<Translate content="user.authentication_type" />}
                                >
                                    <MenuItem value="none" primaryText={<Translate content="user.auth.none" />} />
                                    <MenuItem value="google" primaryText={<Translate content="user.auth.google" />} />
                                    <MenuItem value="sms" primaryText={<Translate content="user.auth.sms" />} />
                                </SelectField>
                                <SelectField
                                    id="locale"
                                    value={this.state.user.locale}
                                    floatingLabelText={<Translate content="user.locale" />}
                                >
                                    <MenuItem value="ru" primaryText={<Translate content="ru" />} />
                                    <MenuItem value="en" primaryText={<Translate content="en" />} />
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
                                />
                            </div>
                        </form>
                    )}
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
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserEdit);
