import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import Table from 'material-ui/Table/Table';
// import TableHeader from 'material-ui/Table/TableHeader';
// import TableBody from 'material-ui/Table/TableBody';
// import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
// import TableRow from 'material-ui/Table/TableRow';
// import TableRowColumn from 'material-ui/Table/TableRowColumn';
import Translate from 'react-translate-component';
import PermissionsModel from 'models/Permissions';
// import Toggle from 'material-ui/Toggle';
import gtTheme from 'themes/indigo';
import { connect } from 'react-redux';
import userActions from 'actions/user';

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

    setIndeterminateState() {
        $(ReactDOM.findDOMNode(this)).find('input.indeterminate').each((i, e) => {
            e.indeterminate = true;
        });
        $(ReactDOM.findDOMNode(this)).find('input:not(.indeterminate)').each((i, e) => {
            e.indeterminate = false;
        });
    }

    componentDidUpdate() {
        this.setIndeterminateState();
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

    render() {
        let title = PermissionsModel.config[this.props.type].leftTitle;
        let leftRowTitles = this.props.permissionsModel.getLeftRowTitles(this.props.type);
        let rows = Object.keys(leftRowTitles).map((id, i) => {
            let properties = {};
            let value = this.props.permissionsModel.getLeftBlockValue(this.state.permissions[id]);
            if (value === null) {
                properties.className = 'indeterminate';
            }
            if (value === true) {
                properties.checked = 'checked';
            }
            let listGroupItemClassName = 'list-item-sm hover-pointer list-group-item';
            if (this.props.permissionsModel.selectedLeftBlock.indexOf(id) > -1) {
                listGroupItemClassName += ' bg-gray-important';
            }
            return (
                <tr key={i} onClick={this.selectRow.bind(this, id, i)}>
                    <td>
                        <input
                            {...properties}
                            type="checkbox"
                            value={value}
                            onChange={this.checkRow.bind(this, id)}
                        />
                        <span style={{marginLeft: 5}}>{leftRowTitles[id]}</span>
                    </td>
                </tr>
            );
        });

        return (
            <table >
                <thead>
                    <tr>
                        <th>{title}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
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
