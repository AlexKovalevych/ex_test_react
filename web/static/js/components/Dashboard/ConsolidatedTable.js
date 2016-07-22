import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';
import Delta from 'components/Delta';
import Translate from 'react-translate-component';
import dashboardActions from 'actions/dashboard';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
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
        let title = `Consolidated chart ${metrics} ${this.props.id}`;
        dispatch(dashboardActions.loadConsolidatedChart(params, {metrics, title}));
    }

    showMonthlyChart(metrics) {
    //     this.setState({openedDialog: `monthly_${metrics}`});
    }

    // getDailyChart(metrics) {
    //     let options = JSON.parse(JSON.stringify(this.defaultZoomChartOptions));
    //     options.chart.type = 'area';
    //     options.rangeSelector.inputEnabled = true;
    //     options.tooltip.formatter = function() {
    //         let result = `${formatter.formatDate(this.x)} `;
    //         let points = [];
    //         for (let point of this.points) {
    //             points.push(`<span style="color: ${point.color};">●</span>${formatter.formatValue(point.y, metrics)}`);
    //         }
    //         return `${points.join(' ')} (${result})`;
    //     };

    //     let data = this.props.consolidatedChart;
    //     let chartData = [];
    //     for (let date of Object.keys(data).reverse()) {
    //         chartData.push({
    //             x: formatter.toTimestamp(date),
    //             y: metrics == 'cashoutsAmount' ? Math.abs(data[date][metrics]) : data[date][metrics]
    //         });
    //     }
    //     options.series = [{
    //         name: translate(`dashboard.${metrics}`),
    //         color: colorManager.getChartColor(metrics),
    //         data: chartData
    //     }];

    //     return (<ReactHighstock config={options} />);
    // }

    // getMonthlyChart(metrics) {

    // }

    renderChartButtons(metrics) {
        return (
            <td style={{width: '13%'}}>
                <IconButton iconStyle={styles.smallIcon} onClick={this.showDailyChart.bind(this, metrics)}>
                    <FontIcon className="material-icons">show_chart</FontIcon>
                </IconButton>
                <IconButton iconStyle={styles.smallIcon} onClick={this.showMonthlyChart.bind(this, metrics)}>
                    <FontIcon className="material-icons">equalizer</FontIcon>
                </IconButton>
            </td>
        );
    }

    render() {
        let currentStats = this.props.stats.current;
        let comparisonStats = this.props.stats.comparison;

        return (
            <table>
                <thead>
                    <tr>
                        <th style={styles.cell}></th>
                        <th>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.current[0])}</th>
                        <th>{formatter.formatDashboardPeriod(this.props.periodType, this.props.periods.comparison[0])}</th>
                        <th style={{width: '20%'}}><Translate content="difference" /></th>
                        <th style={{width: '13%'}}><Translate content="charts" /></th>
                    </tr>
                </thead>
                <tbody>
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

const mapStateToProps = () => {
    return {
//         consolidatedChart: state.dashboard.consolidatedChart
    };
};

export default connect(mapStateToProps)(ConsolidatedTable);
