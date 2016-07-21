import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import Delta from 'components/Delta';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Translate from 'react-translate-component';
import dashboardActions from 'actions/dashboard';
import ShowChartIcon from 'material-ui/svg-icons/editor/show-chart';
import EqualizerIcon from 'material-ui/svg-icons/av/equalizer';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';

let styles = {
    cell: {
        width: '30%',
        whiteSpace: 'normal'
    },
    smallIcon: {
        width: 20,
        height: 20
    }
};

class ConsolidatedTable extends React.Component {


    // static propTypes = {
    //     user: PropTypes.object
    //     data: PropTypes.object,
    // };

    // static contextTypes = {
    //     store: React.PropTypes.object.isRequired
    // };

    static propTypes = {
        dispatch: PropTypes.func,
        consolidatedChart: PropTypes.object,
        periods: PropTypes.object,
        stats: PropTypes.object,
        periodType: PropTypes.string,
        id: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            openedDialog: null
        };
    }

    showDailyChart(metrics) {
        const {dispatch} = this.props;
        let params = ['daily'];
        if (this.props.id) {
            params.push(this.props.id);
        }
        dispatch(dashboardActions.loadConsolidatedChart(params));
        this.setState({openedDialog: `daily_${metrics}`});
    }

    showMonthlyChart(metrics) {
        this.setState({openedDialog: `monthly_${metrics}`});
    }

    closeDialog() {
        this.setState({openedDialog: null});
    }

    renderChartButtons(metrics) {
        return (
            <TableRowColumn style={{width: '13%'}}>
                <IconButton iconStyle={styles.smallIcon} style={styles.smallIcon} onClick={this.showDailyChart.bind(this, metrics)}>
                    <ShowChartIcon />
                </IconButton>
                <Dialog
                    title={metrics}
                    modal={false}
                    open={this.state.openedDialog == `daily_${metrics}`}
                    onRequestClose={this.closeDialog.bind(this)}
                >
                    The actions in this window were passed in as an array of React objects.
                </Dialog>
                <IconButton iconStyle={styles.smallIcon} style={styles.smallIcon} onClick={this.showMonthlyChart.bind(this, metrics)}>
                    <EqualizerIcon />
                </IconButton>
                <Dialog
                    title={metrics}
                    modal={false}
                    open={this.state.openedDialog == `monthly_${metrics}`}
                    onRequestClose={this.closeDialog.bind(this)}
                >
                    The actions in this window were passed in as an array of React objects.
                </Dialog>
            </TableRowColumn>
        );
    }

    render() {
        let currentStats = this.props.stats.current;
        let comparisonStats = this.props.stats.comparison;

        return (
            <Table selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{tableLayout: 'auto'}}>
                    <TableRow>
                        <TableHeaderColumn style={styles.cell}></TableHeaderColumn>
                        <TableHeaderColumn>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0])}</TableHeaderColumn>
                        <TableHeaderColumn>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0])}</TableHeaderColumn>
                        <TableHeaderColumn style={{width: '20%'}}><Translate content="difference" /></TableHeaderColumn>
                        <TableHeaderColumn style={{width: '13%'}}><Translate content="charts" /></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} style={{tableLayout: 'auto'}}>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.average_deposit' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.averageDeposit, 'averageDeposit')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.averageDeposit, 'averageDeposit')}</TableRowColumn>
                        <TableRowColumn style={{width: '20%'}}>
                            <Delta value={formatter.formatValue(currentStats.averageDeposit - comparisonStats.averageDeposit, 'averageDeposit')} />
                        </TableRowColumn>
                        {this.renderChartButtons('averageDeposit')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.arpu' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.arpu, 'arpu')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.arpu, 'arpu')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.arpu - comparisonStats.arpu, 'arpu')} />
                        </TableRowColumn>
                        {this.renderChartButtons('arpu')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.average_first_deposit' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.averageFirstDeposit, 'averageFirstDeposit')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.averageFirstDeposit, 'averageFirstDeposit')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.averageFirstDeposit - comparisonStats.averageFirstDeposit, 'averageFirstDeposit')} />
                        </TableRowColumn>
                        {this.renderChartButtons('averageFirstDeposit')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.deposits_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.depositsNumber, 'depositsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.depositsNumber, 'depositsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.depositsNumber - comparisonStats.depositsNumber, 'depositsNumber')} />
                        </TableRowColumn>
                        {this.renderChartButtons('depositsNumber')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.depositors_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.depositorsNumber, 'depositorsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.depositorsNumber, 'depositorsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.depositorsNumber - comparisonStats.depositorsNumber, 'depositorsNumber')} />
                        </TableRowColumn>
                        {this.renderChartButtons('depositorsNumber')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.first_depositors_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.firstDepositorsNumber, 'firstDepositorsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.firstDepositorsNumber - comparisonStats.firstDepositorsNumber, 'firstDepositorsNumber')} />
                        </TableRowColumn>
                        {this.renderChartButtons('firstDepositorsNumber')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.signups_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.signupsNumber, 'signupsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.signupsNumber, 'signupsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.signupsNumber - comparisonStats.signupsNumber, 'signupsNumber')} />
                        </TableRowColumn>
                        {this.renderChartButtons('signupsNumber')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.first_deposits_amount' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.firstDepositsAmount, 'firstDepositsAmount')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.firstDepositsAmount, 'firstDepositsAmount')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.firstDepositsAmount - comparisonStats.firstDepositsAmount, 'firstDepositsAmount')} />
                        </TableRowColumn>
                        {this.renderChartButtons('firstDepositsAmount')}
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={styles.cell}><Translate content='dashboard.authorizations_number' /></TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(currentStats.authorizationsNumber, 'authorizationsNumber')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.authorizationsNumber, 'authorizationsNumber')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.authorizationsNumber - comparisonStats.authorizationsNumber, 'authorizationsNumber')} />
                        </TableRowColumn>
                        {this.renderChartButtons('authorizationsNumber')}
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        consolidatedChart: state.dashboard.consolidatedChart
    };
};

export default connect(mapStateToProps)(ConsolidatedTable);
