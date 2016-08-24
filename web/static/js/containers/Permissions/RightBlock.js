import React, { PropTypes } from 'react';
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableBody from 'material-ui/Table/TableBody';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import Translate from 'react-translate-component';
import gtTheme from 'themes/indigo';
import permissionsActions from 'actions/permissions';
import permissionsModel from 'models/Permissions';

class RightBlock extends React.Component {
    static propTypes = {
        permissions: PropTypes.array,
        type: PropTypes.string,
        value: PropTypes.string,
        projects: PropTypes.array,
        roles: PropTypes.array,
        dispatch: PropTypes.func,
        selectedLeftRows: PropTypes.array
    };

    onCheckRow(id, e) {
        const {dispatch, type, value, permissions, selectedLeftRows} = this.props;
        let newPermissions = JSON.parse(JSON.stringify(permissions));
        permissionsModel.checkRightRow(newPermissions, type, value, selectedLeftRows, id, e.target.checked);
        dispatch(permissionsActions.update(newPermissions));
    }

    isAllRowsChecked() {
        const {type, value, permissions, projects, roles, selectedLeftRows} = this.props;
        let rightValues = permissionsModel.getRightRowTitles(type, permissions, roles);
        let preparedPermissions = permissionsModel.getPermissions(permissions, projects, roles, type, value);
        let result = true;
        for (let rightValue of rightValues) {
            if (permissionsModel.getRightBlockValue(preparedPermissions, selectedLeftRows, rightValue) !== true) {
                result = false;
                break;
            }
        }
        return result;
    }

    onCheckAllRows() {
        const {type, value, dispatch, permissions, roles, selectedLeftRows} = this.props;
        let rightValues = permissionsModel.getRightRowTitles(type, permissions, roles);
        let newPermissions = JSON.parse(JSON.stringify(permissions));
        if (this.isAllRowsChecked()) {
            for (let rightValue of rightValues) {
                newPermissions = permissionsModel.checkRightRow(newPermissions, type, value, selectedLeftRows, rightValue, false);
            }
        } else {
            for (let rightValue of rightValues) {
                newPermissions = permissionsModel.checkRightRow(newPermissions, type, value, selectedLeftRows, rightValue, true);
            }
        }
        dispatch(permissionsActions.update(newPermissions));
    }

    render() {
        const {type, value, selectedLeftRows, permissions, projects, roles} = this.props;
        if (!permissions) {
            return false;
        }
        let title = permissionsModel.getConfigRightTitle(type);
        let preparedPermissions = permissionsModel.getPermissions(permissions, projects, roles, type, value);
        let titleIds = permissionsModel.getRightRowTitleIds(type, preparedPermissions, roles);
        let rows = titleIds.map((titleId, i) => {
            let value = permissionsModel.getRightBlockValue(preparedPermissions, selectedLeftRows, titleId.id);
            let props = {
                label: titleId.title,
                onCheck: this.onCheckRow.bind(this, titleId.id),
                checked: value,
                inputStyle: {width: gtTheme.theme.spacing.desktopGutter},
                labelStyle: {cursor: 'pointer'}
            };
            if (value === null) {
                props.checkedIcon = (<FontIcon className="material-icons" color={gtTheme.theme.palette.primary1Color}>indeterminate_check_box</FontIcon>);
                props.checked = true;
            }

            return (
                <TableRow key={i}>
                    <TableRowColumn>
                        <Checkbox {...props} />
                    </TableRowColumn>
                </TableRow>
            );
        });
        return (
            <Table className="not-selectable">
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>
                            <Checkbox
                                style={{width: 'inherit', float: 'left'}}
                                checked={this.isAllRowsChecked()}
                                onCheck={this.onCheckAllRows.bind(this)}
                            />
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
        permissions: state.permissions.users,
        projects: state.permissions.projects,
        roles: state.permissions.roles,
        type: state.permissions.type,
        value: state.permissions.value,
        selectedLeftRows: state.permissions.selectedLeftRows
    };
};

export default connect(mapStateToProps)(RightBlock);
