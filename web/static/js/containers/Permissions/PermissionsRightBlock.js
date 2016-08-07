import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Permissions from '../../models/Permissions';
import { Button, ButtonGroup, ListGroupItem, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PermissionsTable from './PermissionsTable';
import permissionsStore from '../../stores/PermissionsStore';
import permissionsActionCreators from '../../actions/PermissionsActionCreators';

export default class PermissionsRightBlock extends React.Component {
    static propTypes = {
        permissionsModel: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            permissions: props.permissionsModel.getPermissions(permissionsStore.type, permissionsStore.value)
        };
    }

    setIndeterminateState() {
        $(ReactDOM.findDOMNode(this)).find('input.indeterminate').each((i, e) => {
            e.indeterminate = true;
        });
        $(ReactDOM.findDOMNode(this)).find('input:not(.indeterminate)').each((i, e) => {
            e.indeterminate = false;
        });
    }

    _onChange() {
        this.setState({
            permissions: this.props.permissionsModel.getPermissions(permissionsStore.type, permissionsStore.value)
        });
    }

    componentDidMount() {
        this.changeListener = this._onChange.bind(this);
        permissionsStore.addChangeListener(this.changeListener);
        this.setIndeterminateState();
    }

    componentWillUnmount() {
        permissionsStore.removeChangeListener(this.changeListener);
    }

    componentDidUpdate() {
        this.setIndeterminateState();
    }

    checkRow(id, e) {
        this.props.permissionsModel.checkRightRow(permissionsStore.type, permissionsStore.value, permissionsStore.selectedLeftRows, id, e.target.checked);
        permissionsActionCreators.updatePermissions();
    }

    selectAll() {
        for (let id of Object.keys(this.props.permissionsModel.getRightRowTitles(permissionsStore.type))) {
            this.props.permissionsModel.checkRightRow(permissionsStore.type, permissionsStore.value, permissionsStore.selectedLeftRows, id, true);
        }
        permissionsActionCreators.updatePermissions();
    }

    unselectAll() {
        for (let id of Object.keys(this.props.permissionsModel.getRightRowTitles(permissionsStore.type))) {
            this.props.permissionsModel.checkRightRow(permissionsStore.type, permissionsStore.value, permissionsStore.selectedLeftRows, id, false);
        }
        permissionsActionCreators.updatePermissions();
    }

    selectRightRow(e) {
        if (e.target.tagName.toLowerCase() != 'input') {
            $(ReactDOM.findDOMNode(e.currentTarget)).find('input').trigger('click');
        }
    }

    render() {
        let title = Permissions.config[permissionsStore.type].rightTitle;
        let rightRowTitles = this.props.permissionsModel.getRightRowTitles(permissionsStore.type);
        let rows = Object.keys(rightRowTitles).map((id, i) => {
            let properties = {};
            let value = this.props.permissionsModel.getRightBlockValue(permissionsStore.selectedLeftRows, this.state.permissions, id);
            if (value === null) {
                properties.className = PermissionsTable.INDETERMINATE;
            } else {
                properties.className = '';
            }
            if (value === true) {
                properties.checked = 'checked';
            }
            return (
                <ListGroupItem key={i} className="list-item-sm hover-pointer" onClick={this.selectRightRow.bind(this)}>
                    <input
                        {...properties}
                        type="checkbox"
                        onChange={this.checkRow.bind(this, id)}
                    />
                    <span style={{marginLeft: 5}}>{rightRowTitles[id]}</span>
                </ListGroupItem>
            );
        });
        return (
            <ListGroup className="col-sm-4">
                <ListGroupItem className="list-item-lg active">
                    <h2 className="mar-no text-center">
                        {title}
                        <ButtonGroup className="mar-lft mar-rgt" style={{display: 'inline-block'}}>
                            <OverlayTrigger placement="top" overlay={(<Tooltip id="select-all">{Translator.trans('form.select_all')}</Tooltip>)}>
                                <Button className="btn-purple" onClick={this.selectAll.bind(this)}>
                                    <i className="fa fa-check-square"></i>
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={(<Tooltip id="unselect-all">{Translator.trans('form.unselect_all')}</Tooltip>)}>
                                <Button className="btn-purple" onClick={this.unselectAll.bind(this)}>
                                    <i className="fa fa-square"></i>
                                </Button>
                            </OverlayTrigger>
                        </ButtonGroup>
                    </h2>
                </ListGroupItem>
                {rows}
            </ListGroup>
        );
    }
}
