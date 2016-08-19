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
        model: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
        selectedRows: PropTypes.array,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.pivotRow = null;
    }

    checkRow(id, e) {
        this.props.model.checkLeftRow(this.props.type, this.props.value, id, e.target.checked);
        const {dispatch} = this.props;
        dispatch(userActions.updatePermissions(this.props.model));
    }

    onSelectRows(id, i, e) {
        let selectedIds = [];
        if (this.pivotRow === null || !e.shiftKey) {
            selectedIds.push(id);
            this.pivotRow = i;
        } else if (e.shiftKey) {
            let titles = Object.keys(this.props.model.getLeftRowTitles(this.props.type));
            for (let index in titles) {
                if ((index >= this.pivotRow && index <= i) ||
                    (index <= this.pivotRow && index >= i)) {
                    selectedIds.push(titles[index]);
                }
            }
        }
        const {dispatch} = this.props;
        dispatch(permissionsActions.selectLeftRows(selectedIds));
    }

    isAllRowsSelected() {
        return this.props.selectedRows.length == Object.keys(this.props.model.getLeftRowTitles(this.props.type)).length;
    }

    onSelectAllRows() {
        const {dispatch} = this.props;
        if (this.isAllRowsSelected()) {
            dispatch(permissionsActions.selectLeftRows([]));
        } else {
            let ids = Object.keys(this.props.model.getLeftRowTitles(this.props.type));
            dispatch(permissionsActions.selectLeftRows(ids));
        }
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
                props.checkedIcon = (<FontIcon className="material-icons" color={gtTheme.theme.palette.primary1Color}>indeterminate_check_box</FontIcon>);
                props.checked = true;
            }
            let style = this.props.selectedRows.indexOf(id) > -1 ? styles.selectedRow : {};
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
