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
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';
import permissionsActions from 'actions/permissions';
import permissionsModel from 'models/Permissions';

const styles = {
    table: {
        width: '100%'
    },
    selectedRow: {
        backgroundColor: '#ccc'
    }
};

class LeftBlock extends React.Component {
    static propTypes = {
        permissions: PropTypes.array,
        type: PropTypes.string,
        value: PropTypes.string,
        projects: PropTypes.array,
        roles: PropTypes.array,
        selectedRows: PropTypes.array,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.pivotRow = null;
    }

    checkRow(id, e) {
        const {type, value, dispatch, permissions, projects, roles} = this.props;
        let newPermissions = permissionsModel.checkLeftRow(permissions, projects, roles, type, value, id, e.target.checked);
        dispatch(permissionsActions.update(newPermissions));
    }

    onSelectRows(id, i, e) {
        const {dispatch, projects, type, permissions, roles, value} = this.props;
        let selectedIds = [];
        if (this.pivotRow === null || !e.shiftKey) {
            selectedIds.push(id);
            this.pivotRow = i;
        } else if (e.shiftKey) {
            let preparedPermissions = permissionsModel.getPermissions(permissions, projects, roles, type, value);
            let ids = permissionsModel.getLeftRowTitleIds(type, preparedPermissions, projects);
            for (let index in ids) {
                if ((index >= this.pivotRow && index <= i) ||
                    (index <= this.pivotRow && index >= i)) {
                    selectedIds.push(ids[index].id);
                }
            }
        }
        dispatch(permissionsActions.selectLeftRows(selectedIds));
    }

    isAllRowsSelected() {
        const {type, permissions, projects, selectedRows} = this.props;
        return selectedRows.length == permissionsModel.getLeftRowTitles(type, permissions, projects).length;
    }

    onSelectAllRows() {
        const {dispatch, type, value, permissions, projects, roles} = this.props;
        let preparedPermissions = permissionsModel.getPermissions(permissions, projects, roles, type, value);
        if (this.isAllRowsSelected()) {
            dispatch(permissionsActions.selectLeftRows([]));
        } else {
            let ids = permissionsModel.getLeftRowTitleIds(type, preparedPermissions, projects).map((value) => {
                return value.id;
            });
            dispatch(permissionsActions.selectLeftRows(ids));
        }
    }

    render() {
        const {type, value, permissions, projects, roles, selectedRows} = this.props;
        if (!permissions) {
            return false;
        }
        let title = permissionsModel.getConfigLeftTitle(type);
        let preparedPermissions = permissionsModel.getPermissions(permissions, projects, roles, type, value);
        let titleIds = permissionsModel.getLeftRowTitleIds(type, preparedPermissions, projects);
        let rows = titleIds.map((titleId, i) => {
            let id = titleId.id;
            let value = permissionsModel.getLeftBlockValue(preparedPermissions[id]);
            let props = {
                label: titleId.title,
                onCheck: this.checkRow.bind(this, id),
                checked: value,
                inputStyle: {width: gtTheme.theme.spacing.desktopGutter},
                labelStyle: {cursor: 'pointer'}
            };
            if (value === null) {
                props.checkedIcon = (<FontIcon className="material-icons" color={gtTheme.theme.palette.primary1Color}>indeterminate_check_box</FontIcon>);
                props.checked = true;
            }
            let style = selectedRows.indexOf(id) > -1 ? styles.selectedRow : {};
            return (
                <TableRow key={i} style={style}>
                    <TableRowColumn>
                        <div onClick={this.onSelectRows.bind(this, id, i)}>
                            <Checkbox {...props} />
                        </div>
                    </TableRowColumn>
                </TableRow>
            );
        });

        return (
            <Table className="not-selectable" style={styles.table} selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>
                            <Checkbox
                                style={{width: 'inherit', float: 'left'}}
                                checked={this.isAllRowsSelected()}
                                onCheck={this.onSelectAllRows.bind(this)}
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
        selectedRows: state.permissions.selectedLeftRows
    };
};

export default connect(mapStateToProps)(LeftBlock);
