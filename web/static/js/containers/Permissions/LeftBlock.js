import React, { PropTypes } from 'react';
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableBody from 'material-ui/Table/TableBody';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import gtTheme from 'themes/indigo';
import userActions from 'actions/user';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import permissionsActions from 'actions/Permissions';
import PermissionsModel from 'models/Permissions';

class LeftBlock extends React.Component {
    static propTypes = {
        model: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
        selectedRows: PropTypes.array,
        dispatch: PropTypes.func
    };

    checkRow(id, e) {
        this.props.model.checkLeftRow(this.props.type, this.props.value, id, e.target.checked);
        const {dispatch} = this.props;
        dispatch(userActions.updatePermissions(this.props.model));
    }

    onSelectRows(selectedRows) {
        let ids = this.props.model.getLeftRowsIds(this.props.type);
        let selectedIds = [];
        for (let i of selectedRows) {
            selectedIds.push(ids[i]);
        }
        this.props.model.selectedLeftBlock = selectedIds;
        const {dispatch} = this.props;
        dispatch(permissionsActions.update(this.props.model, this.props.type, this.props.value));
    }

    render() {
        let model = this.props.model;
        if (!model) {
            return false;
        }
        let type = this.props.type;
        let title = PermissionsModel.config[type].leftTitle;
        let leftRowTitles = model.getLeftRowTitles(type);
        let permissions = model.getPermissions(type, this.props.value);
        let rows = Object.keys(leftRowTitles).map((id, i) => {
            let value = model.getLeftBlockValue(permissions[id]);
            let props = {
                label: leftRowTitles[id],
                onCheck: this.checkRow.bind(this, id),
                checked: value,
                inputStyle: {width: gtTheme.theme.spacing.desktopGutter},
                labelStyle: {cursor: 'pointer'}
            };
            if (value === null) {
                props.checkedIcon = (<FontIcon className="material-icons">indeterminate_check_box</FontIcon>);
            }
            return (
                <TableRow key={i} selected={this.props.selectedRows.indexOf(id) > -1}>
                    <TableRowColumn>
                        <Checkbox {...props} />
                    </TableRowColumn>
                </TableRow>
            );
        });

        return (
            <Table multiSelectable={true} onRowSelection={this.onSelectRows.bind(this)}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>
                            <Translate content={title} />
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {rows}
                </TableBody>
            </Table>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        model: new PermissionsModel(
            state.permissions.users,
            state.permissions.projects,
            state.permissions.roles
        ),
        type: state.permissions.type,
        value: state.permissions.value,
        selectedRows: state.permissions.selectedLeftRows
    };
};

export default connect(mapStateToProps)(LeftBlock);
