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

class RightBlock extends React.Component {
    static propTypes = {
        permissionsModel: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            permissions: props.permissionsModel.getPermissions(this.props.type, this.props.value)
        };
    }

    // setIndeterminateState() {
    //     $(ReactDOM.findDOMNode(this)).find('input.indeterminate').each((i, e) => {
    //         e.indeterminate = true;
    //     });
    //     $(ReactDOM.findDOMNode(this)).find('input:not(.indeterminate)').each((i, e) => {
    //         e.indeterminate = false;
    //     });
    // }

    _onChange() {
        this.setState({
            permissions: this.props.permissionsModel.getPermissions(this.props.type, this.props.value)
        });
    }

    // componentDidMount() {
    //     this.changeListener = this._onChange.bind(this);
    //     permissionsStore.addChangeListener(this.changeListener);
    //     this.setIndeterminateState();
    // }

    // componentWillUnmount() {
    //     permissionsStore.removeChangeListener(this.changeListener);
    // }

    // componentDidUpdate() {
    //     this.setIndeterminateState();
    // }

    checkRow(id, e) {
        this.props.permissionsModel.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, e.target.checked);
        permissionsActionCreators.updatePermissions();
    }

    selectAll() {
        for (let id of Object.keys(this.props.permissionsModel.getRightRowTitles(this.props.type))) {
            this.props.permissionsModel.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, true);
        }
        permissionsActionCreators.updatePermissions();
    }

    unselectAll() {
        for (let id of Object.keys(this.props.permissionsModel.getRightRowTitles(this.props.type))) {
            this.props.permissionsModel.checkRightRow(this.props.type, this.props.value, permissionsStore.selectedLeftRows, id, false);
        }
        permissionsActionCreators.updatePermissions();
    }

    selectRightRow(e) {
        if (e.target.tagName.toLowerCase() != 'input') {
            $(ReactDOM.findDOMNode(e.currentTarget)).find('input').trigger('click');
        }
    }

    onSelectRows(value) {

    }

    render() {
        let title = Permissions.config[this.props.type].rightTitle;
        let rightRowTitles = this.props.permissionsModel.getRightRowTitles(this.props.type);
        let rows = Object.keys(rightRowTitles).map((id, i) => {
            let value = this.props.permissionsModel.getRightBlockValue(this.props.permissionsModel.selectedLeftBlock, this.state.permissions, id);
            let props = {
                label: rightRowTitles[id],
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

export default connect(mapStateToProps)(RightBlock);
