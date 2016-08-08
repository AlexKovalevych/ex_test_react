import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableBody from 'material-ui/Table/TableBody';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import Translate from 'react-translate-component';
import PermissionsModel from 'models/Permissions';
import gtTheme from 'themes/indigo';
import { connect } from 'react-redux';
import userActions from 'actions/user';
import Checkbox from 'material-ui/Checkbox';
import FontIcon from 'material-ui/FontIcon';

class LeftBlock extends React.Component {
    static propTypes = {
        permissionsModel: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.pivotRow = null;
        this.state = {
            permissions: props.permissionsModel.getPermissions(this.props.type, this.props.value)
        };
    }

    checkRow(id, e) {
        this.props.permissionsModel.checkLeftRow(this.props.type, this.props.value, id, e.target.checked);
        const {dispatch} = this.props;
        dispatch(userActions.updatePermissions(this.props.permissionsModel));
    }

    selectRow(id, i, e) {
        let rows = [];
        if (this.pivotRow === null || !e.shiftKey) {
            rows.push(id);
            this.pivotRow = i;
        } else if (e.shiftKey) {
            let titles = Object.keys(this.props.permissionsModel.getLeftRowTitles(this.props.type));
            for (let index in titles) {
                if ((index >= this.pivotRow && index <= i) ||
                    (index <= this.pivotRow && index >= i)) {
                    rows.push(titles[index]);
                }
            }
        }
        this.props.permissionsModel.selectedLeftBlock = rows;
        const {dispatch} = this.props;
        dispatch(userActions.updatePermissions(this.props.permissionsModel));
    }

    onSelectRows(a, b, c) {
        console.log(a, b, c);
    }

    render() {
        let title = PermissionsModel.config[this.props.type].leftTitle;
        let leftRowTitles = this.props.permissionsModel.getLeftRowTitles(this.props.type);
        let rows = Object.keys(leftRowTitles).map((id, i) => {
            let value = this.props.permissionsModel.getLeftBlockValue(this.state.permissions[id]);
            let props = {
                label: leftRowTitles[id],
                onCheck: this.checkRow.bind(this, id),
                checked: value,
                // labelPosition: 'left'
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
//         permissionsModel: new PermissionsModel(
//             state.users.user.permissions,
//             state.users.projects,
//             state.users.roles
//         )
    };
};

export default connect(mapStateToProps)(LeftBlock);
