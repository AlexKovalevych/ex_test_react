import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import modalActions from 'actions/modal';
import translate from 'counterpart';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock.src';
import colorManager from 'managers/ColorManager';
import formatter from 'managers/Formatter';

const styles = {
    width: '75%',
    maxWidth: 'none'
};

class Modal extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        options: PropTypes.object,
        isOpened: PropTypes.bool,
        consolidatedChart: PropTypes.object,
        zoomChart: PropTypes.object
    };

    closeDialog() {
        const { dispatch } = this.props;
        dispatch(modalActions.closeModal());
    }

    getTitle() {
        if (this.props.consolidatedChart || this.props.zoomChart) {
            let data = this.props.consolidatedChart || this.props.zoomChart;
            let dates = Object.keys(data).reverse();
            switch (this.props.options.type) {
            case 'daily':
                return translate(`dashboard.${this.props.options.metrics}_daily`, {
                    from: formatter.formatDate(dates[0]),
                    to: formatter.formatDate(dates[dates.length - 1])
                });
            case 'monthly':
                return translate(`dashboard.${this.props.options.metrics}_monthly`, {
                    from: formatter.formatMonth(dates[0]),
                    to: formatter.formatMonth(dates[dates.length - 1])
                });
            }
        }
        return '';
    }

    get defaultZoomChartOptions() {
        return {
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
    }

    getDailyConsolidatedChart() {
        let options = this.defaultZoomChartOptions;
        let metrics = this.props.options.metrics;
        options.chart.type = 'area';
        options.rangeSelector.inputEnabled = true;
        options.tooltip.formatter = function() {
            let result = `${formatter.formatDate(this.x)} `;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatValue(point.y, metrics, false)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        let data = this.props.consolidatedChart;
        let chartData = [];
        for (let date of Object.keys(data).reverse()) {
            chartData.push({
                x: formatter.toTimestamp(date),
                y: formatter.formatChartValue(data[date][metrics], metrics)
            });
        }
        options.series = [{
            name: translate(`dashboard.${metrics}`),
            color: colorManager.getChartColor(metrics),
            data: chartData
        }];

        return (<ReactHighstock config={options} />);
    }

    getMonthlyConsolidatedChart() {
        let options = this.defaultZoomChartOptions;
        let metrics = this.props.options.metrics;
        options.chart.type = 'column';
        options.rangeSelector.inputEnabled = false;
        options.tooltip.formatter = function() {
            let result = `${formatter.formatMonth(this.x)} `;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatValue(point.y, metrics, false)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        let data = this.props.consolidatedChart;
        let chartData = [];
        let categories = [];
        for (let date of Object.keys(data).reverse()) {
            chartData.push({
                x: formatter.toTimestamp(`${date}-01`),
                y: formatter.formatChartValue(data[date][metrics], metrics)
            });
            categories.push(formatter.formatMonth(`${date}-01`));
        }
        options.xAxis.categories = categories;
        options.series = [{
            name: translate(`dashboard.${metrics}`),
            color: colorManager.getChartColor(metrics),
            data: chartData
        }];

        return (<ReactHighstock config={options} />);
    }

    getDailyZoomChart() {
        let options = this.defaultZoomChartOptions;
        options.chart.type = 'area';
        options.rangeSelector.inputEnabled = true;
        options.tooltip.formatter = function() {
            let result = `${formatter.formatDate(this.x)} `;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatMoney(point.y)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        let data = this.props.zoomChart;
        options.series = [];
        for (let singleMetrics of this.props.options.metrics) {
            if (singleMetrics == 'rakeAmount' && !this.props.options.isPoker) {
                continue;
            }
            let chartData = [];
            for (let date of Object.keys(data).reverse()) {
                chartData.push({
                    x: formatter.toTimestamp(date),
                    y: singleMetrics == 'cashoutsAmount' ? Math.abs(data[date][singleMetrics]) : data[date][singleMetrics]
                });
            }
            options.series.push({
                name: translate(`dashboard.${singleMetrics}`),
                color: colorManager.getChartColor(singleMetrics),
                data: chartData
            });
        }
        return (<ReactHighstock config={options} />);
    }

    getMonthlyZoomChart() {
        let options = this.defaultZoomChartOptions;
        options.chart.type = 'column';
        options.rangeSelector.inputEnabled = false;
        options.tooltip.formatter = function() {
            let result = `${formatter.formatMonth(this.x)} `;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatMoney(point.y)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        let data = this.props.zoomChart;
        options.series = [];
        for (let singleMetrics of this.props.options.metrics) {
            if (singleMetrics == 'rakeAmount' && !this.props.options.isPoker) {
                continue;
            }
            let chartData = [];
            for (let date of Object.keys(data).reverse()) {
                chartData.push({
                    x: formatter.toTimestamp(`${date}-01`),
                    y: Math.abs(data[date][singleMetrics] ? data[date][singleMetrics] / 100 : 0)
                });
            }
            options.series.push({
                name: translate(`dashboard.${singleMetrics}`),
                color: colorManager.getChartColor(singleMetrics),
                data: chartData
            });
        }
        return (<ReactHighstock config={options} />);
    }

    render() {
        let content;
        if (this.props.consolidatedChart) {
            switch(this.props.options.type) {
            case 'daily':
                content = this.getDailyConsolidatedChart();
                break;
            case 'monthly':
                content = this.getMonthlyConsolidatedChart();
                break;
            }
        }

        if (this.props.zoomChart) {
            switch (this.props.options.type) {
            case 'daily':
                content = this.getDailyZoomChart();
                break;
            case 'monthly':
                content = this.getMonthlyZoomChart();
                break;
            }
        }

        return (
            <Dialog
                title={this.getTitle()}
                modal={false}
                open={this.props.isOpened}
                onRequestClose={this.closeDialog.bind(this)}
                contentStyle={styles}
            >{content}</Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpened: state.modal.isOpened,
        options: state.modal.options,
        consolidatedChart: state.modal.consolidatedChart,
        zoomChart: state.modal.zoomChart
    };
};

export default connect(mapStateToProps)(Modal);
