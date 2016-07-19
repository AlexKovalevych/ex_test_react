import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import Delta from 'components/Delta';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Translate from 'react-translate-component';

export default class ConsolidatedTable extends React.Component {
    static propTypes = {
        periods: PropTypes.object,
        stats: PropTypes.object,
        periodType: PropTypes.string
    };

    render() {
        let currentStats = this.props.stats.current;
        let comparisonStats = this.props.stats.comparison;

        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{tableLayout: 'auto'}}>
                    <TableRow>
                        <TableHeaderColumn style={{width: '35%'}}></TableHeaderColumn>
                        <TableHeaderColumn>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0])}</TableHeaderColumn>
                        <TableHeaderColumn>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0])}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '20%'}}><Translate content="difference" /></TableHeaderColumn>
                        <TableHeaderColumn style={{width: '13%'}}><Translate content="charts" /></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} style={{tableLayout: 'auto'}}>
                    <TableRow>
                        <TableRowColumn style={{width: '35%'}}><Translate content='dashboard.average_deposit' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.averageDeposit, 'averageDeposit')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.averageDeposit, 'averageDeposit')}</TableRowColumn>
                        <TableRowColumn style={{width: '20%'}}>
                            <Delta value={formatter.formatValue(currentStats.averageDeposit - comparisonStats.averageDeposit, 'averageDeposit')} />
                        </TableRowColumn>
                        <TableRowColumn style={{width: '13%'}}>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.arpu' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.arpu, 'arpu')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.arpu, 'arpu')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.arpu - comparisonStats.arpu, 'arpu')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.average_first_deposit' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.averageFirstDeposit, 'averageFirstDeposit')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.averageFirstDeposit, 'averageFirstDeposit')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.averageFirstDeposit - comparisonStats.averageFirstDeposit, 'averageFirstDeposit')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.deposits_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.depositsNumber, 'depositsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.depositsNumber, 'depositsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.depositsNumber - comparisonStats.depositsNumber, 'depositsNumber')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.depositors_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.firstDepositorsNumber, 'firstDepositorsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.firstDepositorsNumber - comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.signups_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.signupsNumber, 'signupsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.signupsNumber, 'signupsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.signupsNumber - comparisonStats.signupsNumber, 'signupsNumber')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.first_deposits_amount' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.firstDepositsAmount, 'firstDepositsAmount')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.firstDepositsAmount, 'firstDepositsAmount')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.firstDepositsAmount - comparisonStats.firstDepositsAmount, 'firstDepositsAmount')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn><Translate content='dashboard.authorizations_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.authorizationsNumber, 'authorizationsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.authorizationsNumber, 'authorizationsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.authorizationsNumber - comparisonStats.authorizationsNumber, 'authorizationsNumber')} />
                        </TableRowColumn>
                        <TableRowColumn>
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}
