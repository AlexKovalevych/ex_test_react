import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import Delta from 'components/Delta';

export default class ConsolidatedTable extends React.Component {
    static propTypes = {
        periods: PropTypes.object,
        stats: PropTypes.object
    };

    render() {
        let currentStats = this.props.stats.current;
        let comparisonStats = this.props.stats.comparison;

        return (
            <table className="table table-sm table-hover">
                <thead className="thead-default">
                    <tr>
                        <th></th>
                        <th>Current</th>
                        <th>Previous</th>
                        <th>Delta</th>
                        <th>Charts</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Average receipt</th>
                        <td>{formatter.formatValue(currentStats.averageDeposit, 'averageDeposit')}</td>
                        <td>{formatter.formatValue(comparisonStats.averageDeposit, 'averageDeposit')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.averageDeposit - comparisonStats.averageDeposit, 'averageDeposit')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">ARPU</th>
                        <td>{formatter.formatValue(currentStats.arpu, 'arpu')}</td>
                        <td>{formatter.formatValue(comparisonStats.arpu, 'arpu')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.arpu - comparisonStats.arpu, 'arpu')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Average first deposit</th>
                        <td>{formatter.formatValue(currentStats.averageFirstDeposit, 'averageFirstDeposit')}</td>
                        <td>{formatter.formatValue(comparisonStats.averageFirstDeposit, 'averageFirstDeposit')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.averageFirstDeposit - comparisonStats.averageFirstDeposit, 'averageFirstDeposit')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Deposits number</th>
                        <td>{formatter.formatValue(currentStats.depositsNumber, 'depositsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.depositsNumber, 'depositsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.depositsNumber - comparisonStats.depositsNumber, 'depositsNumber')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Depositors number</th>
                        <td>{formatter.formatValue(currentStats.depositorsNumber, 'depositorsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.depositorsNumber, 'depositorsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.depositorsNumber - comparisonStats.depositorsNumber, 'depositorsNumber')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">First depositors number</th>
                        <td>{formatter.formatValue(currentStats.firstDepositorsNumber, 'firstDepositorsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.firstDepositorsNumber - comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Signups number</th>
                        <td>{formatter.formatValue(currentStats.signupsNumber, 'signupsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.signupsNumber, 'signupsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.signupsNumber - comparisonStats.signupsNumber, 'signupsNumber')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">First deposits amount</th>
                        <td>{formatter.formatValue(currentStats.firstDepositsAmount, 'firstDepositsAmount')}</td>
                        <td>{formatter.formatValue(comparisonStats.firstDepositsAmount, 'firstDepositsAmount')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.firstDepositsAmount - comparisonStats.firstDepositsAmount, 'firstDepositsAmount')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">Authorizations number</th>
                        <td>{formatter.formatValue(currentStats.authorizationsNumber, 'authorizationsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.authorizationsNumber, 'authorizationsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.authorizationsNumber - comparisonStats.authorizationsNumber, 'authorizationsNumber')} />
                        </td>
                        <td className="text-overflow">
                            <span className="chart-icon">
                                <i className="fa fa-area-chart fa-lg padding-5"></i>
                            </span>
                            <span className="chart-icon mar-no">
                                <i className="fa fa-bar-chart fa-lg padding-5"></i>
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
