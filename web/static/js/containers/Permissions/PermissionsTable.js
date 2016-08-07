import React, { PropTypes } from 'react';
import permissionsStore from '../../stores/PermissionsStore';
import { Button } from 'react-bootstrap';
import PermissionsLeftBlock from './PermissionsLeftBlock';
import PermissionsRightBlock from './PermissionsRightBlock';

export default class PermissionsTable extends React.Component {
    static INDETERMINATE = 'indeterminate';

    static propTypes = {
        permissionsModel: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            permissions: this.props.permissionsModel.getPermissions(permissionsStore.type, permissionsStore.value),
            isSaving: false,
            serverError: '',
            serverSuccess: ''
        };
    }

    _onChange() {
        this.setState({
            permissions: this.props.permissionsModel.getPermissions(permissionsStore.type, permissionsStore.value),
            serverError: '',
            serverSuccess: ''
        });
    }

    componentDidMount() {
        this.changeListener = this._onChange.bind(this);
        permissionsStore.addChangeListener(this.changeListener);
    }

    componentWillUnmount() {
        permissionsStore.removeChangeListener(this.changeListener);
    }

    submit() {
        this.setState({
            isSaving: true,
            serverError: '',
            serverSuccess: ''
        });
        $.post(
            Routing.generate('globotunes_permissions_update'),
            {permissions: JSON.stringify(this.props.permissionsModel.permissions), csrf: this.props.permissionsModel.csrf}
        )
            .done(() => {
                this.setState({
                    isSaving: false,
                    serverError: '',
                    serverSuccess: Translator.trans('flash.changes_saved')
                });
            })
            .fail(() => {
                this.setState({
                    isSaving: false,
                    serverError: Translator.trans('errors.server_error'),
                    serverSuccess: ''
                });
            })
        ;
    }

    render() {
        let submitIcon;
        let disabledClass;
        if (this.state.isSaving) {
            submitIcon = (<i className="fa fa-spinner fa-spin"></i>);
            disabledClass = 'disabled';
        }

        if (this.state.permissions) {
            return (
                <div>
                    <div className="row">
                        <PermissionsLeftBlock permissionsModel={this.props.permissionsModel} offset="col-sm-offset-2" />
                        <PermissionsRightBlock permissionsModel={this.props.permissionsModel} />
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-2 text-danger">{ this.state.serverError }</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-2 text-success">{ this.state.serverSuccess }</div>
                    </div>
                    <div className="row">
                        <div className="col-sm-offset-2">
                            <Button type="submit" bsStyle="primary" className={disabledClass} onClick={this.submit.bind(this)}>{Translator.trans('form.save')}</Button> {submitIcon}
                        </div>
                    </div>
                </div>
            );
        }
        return (<div></div>);
    }
}
