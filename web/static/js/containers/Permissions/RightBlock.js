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

    onCheckRow(id, e) {
        const {dispatch} = this.props;
        let value = false;
        if (e.target.checked) {
            value = true;
        }
        this.props.model.checkRightRow(this.props.type, this.props.value, this.props.selectedLeftRows, id, value);
        dispatch(permissionsActions.update(this.props.model, this.props.type, this.props.value));
    }

    selectRightRow(e) {
        if (e.target.tagName.toLowerCase() != 'input') {
            $(ReactDOM.findDOMNode(e.currentTarget)).find('input').trigger('click');
        }
    }

    isAllRowsChecked() {
        let type = this.props.type;
        let value = this.props.value;
        let model = this.props.model;
        let rightValues = Object.keys(model.getRightRowTitles(type));
        let selectedLeftRows = this.props.selectedLeftRows;
        let permissions = model.getPermissions(type, value);
        let result = true;
        for (let rightValue of rightValues) {
            if (model.getRightBlockValue(selectedLeftRows, permissions, rightValue) !== true) {
                result = false;
                break;
            }
        }
        return result;
    }

    onCheckAllRows() {
        let model = this.props.model;
        let type = this.props.type;
        let value = this.props.value;
        let selectedLeftRows = this.props.selectedLeftRows;
        let rightValues = Object.keys(model.getRightRowTitles(type));
        const {dispatch} = this.props;
        if (this.isAllRowsChecked()) {
            for (let rightValue of rightValues) {
                model.checkRightRow(type, value, selectedLeftRows, rightValue, false);
            }
        } else {
            for (let rightValue of rightValues) {
                model.checkRightRow(type, value, selectedLeftRows, rightValue, true);
            }
        }
        dispatch(permissionsActions.update(this.props.model, this.props.type, this.props.value));
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
                onCheck: this.onCheckRow.bind(this, id),
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
