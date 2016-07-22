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
import ReactHighstock from 'react-highcharts/dist/ReactHighstock.src';
import translate from 'counterpart';
import colorManager from 'managers/ColorManager';

let styles = {
    cell: {
        width: '30%',
        whiteSpace: 'normal'
    },
    smallIcon: {
        width: 20,
        height: 20
    },
    dialog: {
        width: '75%',
        maxWidth: 'none'
    }
};

class ConsolidatedTable extends React.Component {
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
        this.defaultZoomChartOptions = {
            credits: {
                enabled: false
            },
            chart: {},
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            xAxis: {
                labels: {},
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: null
                }
            },
            tooltip: {},
            rangeSelector: {
                inputDateFormat: '%Y-%m-%d',
                inputEditDateFormat: '%Y-%m-%d',
                inputStyle: {
                    color: '#9a9fa3',
                    fontWeight: 100
                },
                inputBoxBorderColor: '#9a9fa3',
                buttons: [
                    {
                        type: 'month',
                        count: 1,
                        text: translate('highstock.1m')
                    },
                    {
                        type: 'month',
                        count: 3,
                        text: translate('highstock.3m')
                    },
                    {
                        type: 'month',
                        count: 6,
                        text: translate('highstock.6m')
                    },
                    {
                        type: 'ytd',
                        text: translate('highstock.ytd')
                    },
                    {
                        type: 'year',
                        count: 1,
                        text: translate('highstock.1y')
                    },
                    {
                        type: 'all',
                        text: translate('highstock.all')
                    }
                ],
                buttonTheme: {
                    fill: '#e7ebee',
                    stroke: '#9a9fa3',
                    'stroke-width': 1,
                    style: {
                        color: '#9a9fa3'
                    },
                    states: {
                        hover: {
                            fill: '#31404e',
                            style: {color: 'white'},
                            stroke: '#9a9fa3',
                            'stroke-width': 1
                        },
                        select: {
                            fill: '#9a9fa3',
                            stroke: '#9a9fa3',
                            style: {
                                color: 'white'
                            }
                        }
                    },
                    width: null,
                    padding: 5
                },
                buttonSpacing: 0,
                labelStyle: {
                    display: 'none'
                }
            },
            plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    pointPadding: 0,
                    groupPadding: 0,
                    borderWidth: 0,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        enabled: false
                    },
                    fillOpacity: 0.25
                },
                area: {
                    marker: {
                        lineWidth: 1,
                        radius: 1
                    }
                },
                column: {
                    stacking: 'normal'
                }
            }
        };

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

    getDailyChart(metrics) {
        let options = JSON.parse(JSON.stringify(this.defaultZoomChartOptions));
        options.chart.type = 'area';
        options.rangeSelector.inputEnabled = true;
        options.tooltip.formatter = function() {
            let result = `${formatter.formatDate(this.x)} `;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatValue(point.y, metrics)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        let data = this.props.consolidatedChart;
        let chartData = [];
        for (let date of Object.keys(data).reverse()) {
            chartData.push({
                x: formatter.toTimestamp(date),
                y: metrics == 'cashoutsAmount' ? Math.abs(data[date][metrics]) : data[date][metrics]
            });
        }
        options.series = [{
            name: translate(`dashboard.${metrics}`),
            color: colorManager.getChartColor(metrics),
            data: chartData
        }];

        return (<ReactHighstock config={options} />);
    }

    getMonthlyChart(metrics) {

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
                    contentStyle={styles.dialog}
                >
                    {
                        this.props.consolidatedChart && this.state.openedDialog == `daily_${metrics}` && this.getDailyChart(metrics)
                    }
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
                    {
                        this.props.consolidatedChart && this.state.openedDialog == `monthly_${metrics}` && this.getMonthlyChart(metrics)
                    }
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
                        <TableRowColumn>{formatter.formatValue(currentStats.averageArpu, 'averageArpu')}</TableRowColumn>
                        <TableRowColumn>{formatter.formatValue(comparisonStats.averageArpu, 'averageArpu')}</TableRowColumn>
                        <TableRowColumn>
                            <Delta value={formatter.formatValue(currentStats.averageArpu - comparisonStats.averageArpu, 'averageArpu')} />
                        </TableRowColumn>
                        {this.renderChartButtons('averageArpu')}
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
