import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import spinnerActions from 'actions/spinner';
import permissionActions from 'actions/permissions';
import Translate from 'react-translate-component';
import Title from 'components/Title';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import PermissionsLeftBlock from 'containers/Permissions/LeftBlock';
import PermissionsRightBlock from 'containers/Permissions/RightBlock';

class PermissionsIndex extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        data: PropTypes.object
    };

    loadData(props, update=false) {
        const {dispatch, ws} = props;
        if (ws.channels['admins'] && update) {
            dispatch(permissionActions.load());
        } else {
            dispatch(spinnerActions.stop());
        }
        if (!props.errors && props.data) {
            this.setState({permissions: props.data});
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    getTitle() {
        return (
            <Title>
                <Translate content="menu.permissions" />
            </Title>
        );
    }

    onChangeType(e, value) {
        const {dispatch} = this.props;
        dispatch(permissionActions.setType(value));
    }

    onChangeValue(e, i, value) {
        const {dispatch} = this.props;
        dispatch(permissionActions.setValue(value));
    }

    getValues() {
        switch (this.props.data.type) {
        case 'user':
            return this.props.data.users;
        case 'project':
            return this.props.data.projects;
        case 'role':
            return this.props.data.roles;
        }
    }

    updatePermissions(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch(permissionActions.save(this.props.data.users));
    }

    render() {
        if (!this.props.data) {
            return (
                <div>
                    <div className="row">
                        {this.getTitle()}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="row">
                    {this.getTitle()}
                    <form className="row" style={{width: '100%'}} onSubmit={this.updatePermissions.bind(this)}>
                        <div className="col-lg-4 col-md-6 col-xs-12">
                            <RadioButtonGroup name="type" defaultSelected={this.props.data.type} onChange={this.onChangeType.bind(this)}>
                                <RadioButton
                                    value="user"
                                    label={<Translate content="permissions.user" />}
                                />
                                <RadioButton
                                    value="project"
                                    label={<Translate content="permissions.project" />}
                                />
                                <RadioButton
                                    value="role"
                                    label={<Translate content="permissions.role" />}
                                />
                            </RadioButtonGroup>
                            {
                                this.props.data.type == 'user' &&
                                (
                                    <div className="col-lg-4 col-md-6 col-xs-12">
                                        <SelectField value={this.props.data.value} onChange={this.onChangeValue.bind(this)}>
                                        {this.getValues().map((user, i) => {
                                            return (<MenuItem key={i} value={user.id} primaryText={user.email} />);
                                        })}
                                        </SelectField>
                                    </div>
                                )
                            }
                            {
                                this.props.data.type == 'project' &&
                                (
                                    <div className="col-lg-4 col-md-6 col-xs-12">
                                        <SelectField value={this.props.data.value} onChange={this.onChangeValue.bind(this)}>
                                        {this.getValues().map((project, i) => {
                                            return (<MenuItem key={i} value={project.id} primaryText={project.title} />);
                                        })}
                                        </SelectField>
                                    </div>
                                )
                            }
                            {
                                this.props.data.type == 'role' &&
                                (
                                    <div className="col-lg-4 col-md-6 col-xs-12">
                                        <SelectField value={this.props.data.value} onChange={this.onChangeValue.bind(this)}>
                                        {this.getValues().map((role, i) => {
                                            return (<MenuItem key={i} value={role.id} primaryText={role.title} />);
                                        })}
                                        </SelectField>
                                    </div>
                                )
                            }
                        </div>
                        {
                            this.props.data.type && this.props.data.value && ([
                                <div key="left" className="col-lg-2 col-md-3 col-xs-6">
                                    <PermissionsLeftBlock />
                                </div>,
                                <div key="right" className="col-lg-2 col-md-3 col-xs-6">
                                    <PermissionsRightBlock />
                                </div>
                            ])
                        }
                        {
                            this.props.data.type && this.props.data.value && (
                                <div className="col-xs-12 col-lg-12 col-md-12 center-xs">
                                    <RaisedButton
                                        type="submit"
                                        label={<Translate content="form.save" />}
                                        primary={true}
                                    />
                                </div>
                            )
                        }
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.permissions,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(PermissionsIndex);
