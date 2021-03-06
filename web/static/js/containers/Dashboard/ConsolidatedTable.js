import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import Delta from 'components/Delta';
import Translate from 'react-translate-component';
import dashboardActions from 'actions/dashboard';
import FontIcon from 'material-ui/FontIcon';
import { connect } from 'react-redux';
import gtTheme from 'themes/indigo';
import FlatButton from 'material-ui/FlatButton';

let styles = {
    cell: {
        width: '30%',
        whiteSpace: 'normal'
    },
    smallIcon: {
        width: 36,
        height: 36,
        maxWidth: 36,
        minWidth: 36
    }
};

class ConsolidatedTable extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        periods: PropTypes.object,
        stats: PropTypes.object,
        periodType: PropTypes.string,
        id: PropTypes.string
    };

    showDailyChart(metrics) {
        const {dispatch} = this.props;
        let type = 'daily';
        let params = [type];
        if (this.props.id) {
            params.push(this.props.id);
        }
        dispatch(dashboardActions.loadConsolidatedChart(params, {metrics, type}));
    }

    showMonthlyChart(metrics) {
        const {dispatch} = this.props;
        let type = 'monthly';
        let params = [type];
        if (this.props.id) {
            params.push(this.props.id);
        }
        dispatch(dashboardActions.loadConsolidatedChart(params, {metrics, type}));
    }

    renderChartButtons(metrics) {
        return (
            <td style={{width: '13%'}}>
                <FlatButton
                    icon={<FontIcon className="material-icons">show_chart</FontIcon>}
                    style={styles.smallIcon}
                    onClick={this.showDailyChart.bind(this, metrics)}
                />
                <FlatButton
                    icon={<FontIcon className="material-icons">equalizer</FontIcon>}
                    style={styles.smallIcon}
                    onClick={this.showMonthlyChart.bind(this, metrics)}
                />
            </td>
        );
    }

    render() {
        let currentStats = this.props.stats.current;
        let comparisonStats = this.props.stats.comparison;

        return (
            <table className="mdl-data-table" style={gtTheme.theme.table}>
                <thead style={{tableLayout: 'auto'}}>
                    <tr>
                        <th style={styles.cell}></th>
                        <th>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0], 'current')}</th>
                        <th>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0], 'previous')}</th>
                        <th style={{width: '20%'}}><Translate content="difference" /></th>
                        <th style={{width: '13%'}}><Translate content="charts" /></th>
                    </tr>
                </thead>
                <tbody style={{tableLayout: 'auto'}}>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.average_deposit' /></td>
                        <td>{formatter.formatValue(currentStats.averageDeposit, 'averageDeposit')}</td>
                        <td>{formatter.formatValue(comparisonStats.averageDeposit, 'averageDeposit')}</td>
                        <td style={{width: '20%'}}>
                            <Delta value={formatter.formatValue(currentStats.averageDeposit - comparisonStats.averageDeposit, 'averageDeposit')} />
                        </td>
                        {this.renderChartButtons('averageDeposit')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.arpu' /></td>
                        <td>{formatter.formatValue(currentStats.averageArpu, 'averageArpu')}</td>
                        <td>{formatter.formatValue(comparisonStats.averageArpu, 'averageArpu')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.averageArpu - comparisonStats.averageArpu, 'averageArpu')} />
                        </td>
                        {this.renderChartButtons('averageArpu')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.average_first_deposit' /></td>
                        <td>{formatter.formatValue(currentStats.averageFirstDeposit, 'averageFirstDeposit')}</td>
                        <td>{formatter.formatValue(comparisonStats.averageFirstDeposit, 'averageFirstDeposit')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.averageFirstDeposit - comparisonStats.averageFirstDeposit, 'averageFirstDeposit')} />
                        </td>
                        {this.renderChartButtons('averageFirstDeposit')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.deposits_number' /></td>
                        <td>{formatter.formatValue(currentStats.depositsNumber, 'depositsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.depositsNumber, 'depositsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.depositsNumber - comparisonStats.depositsNumber, 'depositsNumber')} />
                        </td>
                        {this.renderChartButtons('depositsNumber')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.depositors_number' /></td>
                        <td>{formatter.formatValue(currentStats.depositorsNumber, 'depositorsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.depositorsNumber, 'depositorsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.depositorsNumber - comparisonStats.depositorsNumber, 'depositorsNumber')} />
                        </td>
                        {this.renderChartButtons('depositorsNumber')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.first_depositors_number' /></td>
                        <td>{formatter.formatValue(currentStats.firstDepositorsNumber, 'firstDepositorsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.firstDepositorsNumber - comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')} />
                        </td>
                        {this.renderChartButtons('firstDepositorsNumber')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.signups_number' /></td>
                        <td>{formatter.formatValue(currentStats.signupsNumber, 'signupsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.signupsNumber, 'signupsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.signupsNumber - comparisonStats.signupsNumber, 'signupsNumber')} />
                        </td>
                        {this.renderChartButtons('signupsNumber')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.first_deposits_amount' /></td>
                        <td>{formatter.formatValue(currentStats.firstDepositsAmount, 'firstDepositsAmount')}</td>
                        <td>{formatter.formatValue(comparisonStats.firstDepositsAmount, 'firstDepositsAmount')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.firstDepositsAmount - comparisonStats.firstDepositsAmount, 'firstDepositsAmount')} />
                        </td>
                        {this.renderChartButtons('firstDepositsAmount')}
                    </tr>
                    <tr>
                        <td style={styles.cell}><Translate content='dashboard.authorizations_number' /></td>
                        <td>{formatter.formatValue(currentStats.authorizationsNumber, 'authorizationsNumber')}</td>
                        <td>{formatter.formatValue(comparisonStats.authorizationsNumber, 'authorizationsNumber')}</td>
                        <td>
                            <Delta value={formatter.formatValue(currentStats.authorizationsNumber - comparisonStats.authorizationsNumber, 'authorizationsNumber')} />
                        </td>
                        {this.renderChartButtons('authorizationsNumber')}
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default connect()(ConsolidatedTable);
