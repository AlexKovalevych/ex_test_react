import React, { PropTypes } from 'react';
import Table from 'material-ui/Table/Table';
import TableBody from 'material-ui/Table/TableBody';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import Translate from 'react-translate-component';
import Toggle from 'material-ui/Toggle';
import gtTheme from 'themes/indigo';

export default class Permissions extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        projects: PropTypes.array,
        permissions: PropTypes.permissions
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: []
        };
    }

    render() {
        let rowsNumber = Math.max(this.props.projects.length, this.props.permissions.length);
        let rows = [];
        for (let i = 0; i < rowsNumber; i++) {
            rows.push(
                <TableRowColumn></TableRowColumn>
            );
        }

        return (
            <table className="mdl-data-table" style={gtTheme.theme.table}>
                <thead style={{tableLayout: 'auto'}}>
                    <tr>
                        <th><Translate content="permissions.project" /></th>
                    </tr>
                </thead>
                <tbody style={{tableLayout: 'auto'}}>
                    {this.props.projects.map((project) => {
                        return (
                            <tr>
                                <td>
                                    <Toggle
                                        label={project.title}
                                        labelPosition="right"
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
