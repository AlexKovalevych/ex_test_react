import React, {PropTypes} from 'react';

export default class ConsolidatedTable extends React.Component {
    static propTypes = {
        project: PropTypes.object,
        currentPeriod: PropTypes.string,
        previousPeriod: PropTypes.string,
        stats: PropTypes.object
    };

    render() {
        let currentStats = this.props.stats[this.props.currentPeriod];
        let previousStats = this.props.stats[this.props.previousPeriod];

        return (
            <table className="table table-sm">
                <thead>
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
                        <td>{currentStats.averageDeposit}</td>
                        <td>{previousStats.averageDeposit}</td>
                        <td>{currentStats.averageDeposit - previousStats.averageDeposit}</td>
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
                        <td>{currentStats.arpu}</td>
                        <td>{previousStats.arpu}</td>
                        <td>{currentStats.arpu - previousStats.arpu}</td>
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
                        <td>{currentStats.averageFirstDeposit}</td>
                        <td>{previousStats.averageFirstDeposit}</td>
                        <td>{currentStats.averageFirstDeposit - previousStats.averageFirstDeposit}</td>
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
                        <td>{currentStats.depositsNumber}</td>
                        <td>{previousStats.depositsNumber}</td>
                        <td>{currentStats.depositsNumber - previousStats.depositsNumber}</td>
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
                        <td>{currentStats.depositorsNumber}</td>
                        <td>{previousStats.depositorsNumber}</td>
                        <td>{currentStats.depositorsNumber - previousStats.depositorsNumber}</td>
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
                        <td>{currentStats.firstDepositorsNumber}</td>
                        <td>{previousStats.firstDepositorsNumber}</td>
                        <td>{currentStats.firstDepositorsNumber - previousStats.firstDepositorsNumber}</td>
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
                        <td>{currentStats.signupsNumber}</td>
                        <td>{previousStats.signupsNumber}</td>
                        <td>{currentStats.signupsNumber - previousStats.signupsNumber}</td>
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
                        <td>{currentStats.firstDepositsAmount}</td>
                        <td>{previousStats.firstDepositsAmount}</td>
                        <td>{currentStats.firstDepositsAmount - previousStats.firstDepositsAmount}</td>
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
                        <td>{currentStats.authorizationsNumber}</td>
                        <td>{previousStats.authorizationsNumber}</td>
                        <td>{currentStats.authorizationsNumber - previousStats.authorizationsNumber}</td>
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
