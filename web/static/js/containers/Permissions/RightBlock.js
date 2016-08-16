import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Permissions from 'models/Permissions';
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
import permissionsActions from 'actions/Permissions';
import PermissionsModel from 'models/Permissions';

class RightBlock extends React.Component {
    static propTypes = {
        model: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
        dispatch: PropTypes.func,
        selectedLeftRows: PropTypes.array
    };

    checkRow(id, e) {
        this.props.model.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, e.target.checked);
        permissionsActionCreators.updatePermissions();
    }

    selectAll() {
        for (let id of Object.keys(this.props.model.getRightRowTitles(this.props.type))) {
            this.props.model.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, true);
        }
        permissionsActionCreators.updatePermissions();
    }

    unselectAll() {
        for (let id of Object.keys(this.props.model.getRightRowTitles(this.props.type))) {
            this.props.model.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, false);
        }
        permissionsActionCreators.updatePermissions();
    }

    selectRightRow(e) {
        if (e.target.tagName.toLowerCase() != 'input') {
            $(ReactDOM.findDOMNode(e.currentTarget)).find('input').trigger('click');
        }
    }

    onSelectRows(rows) {

    }

    render() {
        let model = this.props.model;
        if (!model) {
            return false;
        }
        let type = this.props.type;
        let title = Permissions.config[type].rightTitle;
        let rightRowTitles = model.getRightRowTitles(type);
        let permissions = model.getPermissions(type, this.props.value);
        let rows = Object.keys(rightRowTitles).map((id, i) => {
            let value = model.getRightBlockValue(this.props.selectedLeftRows, permissions, id);
            let props = {
                label: rightRowTitles[id],
                onCheck: this.checkRow.bind(this, id),
                checked: value,
                inputStyle: {width: gtTheme.theme.spacing.desktopGutter},
                labelStyle: {cursor: 'pointer'}
            };
            if (value === null) {
                props.checkedIcon = (<FontIcon className="material-icons">indeterminate_check_box</FontIcon>);
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
        selectedLeftRows: state.permissions.selectedLeftRows
    };
};

export default connect(mapStateToProps)(RightBlock);
