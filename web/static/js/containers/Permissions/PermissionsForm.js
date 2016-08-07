import React, { PropTypes } from 'react';
import { ButtonGroup, Input } from 'react-bootstrap';
import permissionsActionCreators from '../../actions/PermissionsActionCreators';
import permissionsStore from '../../stores/PermissionsStore';
import Selectpicker from '../Selectpicker';

export default class PermissionsForm extends React.Component {
    static propTypes = {
        permissionsModel: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            type: permissionsStore.type,
            project: props.permissionsModel.projectOptions[0],
            user: props.permissionsModel.userOptions[0],
            role: props.permissionsModel.roleOptions[0]
        };
    }

    onChangeTypeOption(value) {
        let newState = {};
        newState[this.state.type] = value;
        this.setState(newState);
        permissionsActionCreators.updatePermissionsValue(value.value, this.props.permissionsModel.getLeftRowsIds(permissionsStore.type));
    }

    onChangeType(event) {
        let type = event.target.value;
        this.setState({type});
        permissionsActionCreators.updatePermissionsType(
            type,
            this.state[type].value,
            this.props.permissionsModel.getLeftRowsIds(type)
        );
    }

    getGroupClass(type) {
        if (permissionsStore.type == type) {
            return 'form-group';
        }

        return 'hide';
    }

    render() {
        return (
            <form className="form-horizontal">
                <div className="form-group">
                    <label className="col-sm-2 control-label">{Translator.trans('form.type')}</label>
                    <div className="col-sm-10">
                        <ButtonGroup>
                            <Input
                                type="radio"
                                name="type"
                                value='project'
                                standalone
                                label={Translator.trans('form.project')}
                                onChange={this.onChangeType.bind(this)}
                                checked={this.state.type == 'project'}
                            />
                            <Input
                                type="radio"
                                name="type"
                                value='user'
                                standalone
                                label={Translator.trans('form.user')}
                                onChange={this.onChangeType.bind(this)}
                                checked={this.state.type == 'user'}
                            />
                            <Input
                                type="radio"
                                name="type"
                                value='role'
                                standalone
                                label={Translator.trans('form.role')}
                                onChange={this.onChangeType.bind(this)}
                                checked={this.state.type == 'role'}
                            />
                        </ButtonGroup>
                    </div>
                </div>
                <div className={this.getGroupClass('project')}>
                    <span className="col-sm-2 control-label">{Translator.trans('form.project')}</span>
                    <div className="col-sm-4">
                        <Selectpicker
                            multi={false}
                            options={this.props.permissionsModel.projectOptions}
                            onChange={this.onChangeTypeOption.bind(this)}
                            defaultValue={this.state.project}
                            clearable={false}
                        />
                    </div>
                </div>
                <div className={this.getGroupClass('user')}>
                    <span className="col-sm-2 control-label">{Translator.trans('form.user')}</span>
                    <div className="col-sm-4">
                        <Selectpicker
                            multi={false}
                            options={this.props.permissionsModel.userOptions}
                            onChange={this.onChangeTypeOption.bind(this)}
                            defaultValue={this.state.user}
                            clearable={false}
                        />
                    </div>
                </div>
                <div className={this.getGroupClass('role')}>
                    <span className="col-sm-2 control-label">{Translator.trans('form.role')}</span>
                    <div className="col-sm-4">
                        <Selectpicker
                            multi={false}
                            options={this.props.permissionsModel.roleOptions}
                            onChange={this.onChangeTypeOption.bind(this)}
                            defaultValue={this.state.role}
                            clearable={false}
                        />
                    </div>
                </div>
            </form>
        );
    }
}
