import React, {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Translate from 'react-translate-component';
import gtTheme from 'themes';
import ReactHighcharts from 'react-highcharts/dist/ReactHighcharts.src';
import formatter from 'managers/Formatter';
import colorManager from 'managers/ColorManager';
import translate from 'counterpart';

let defaultChartOptions = {
    chart: {
        backgroundColor: null,
        borderWidth: 0,
        type: 'area',
        margin: [0, 0, 0, 0],
        style: {
            overflow: 'visible'
        },
        skipClone: true,
        height: 40
    },
    title: {
        text: null
    },
    credits: {
        enabled: false
    },
    xAxis: {
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        startOnTick: false,
        endOnTick: false,
        minPadding:0,
        maxPadding:0,
        tickPositions: []
    },
    yAxis: {
        endOnTick: false,
        startOnTick: false,
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        tickPositions: [0]
    },
    legend: {
        enabled: false
    },
    tooltip: {
        shadow: false,
        useHTML: true,
        hideDelay: 0,
        shared: true,
        padding: 0,
        borderWidth: 0,
        backgroundColor: null
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
    },
    spacing: [0, 0, 0, 0]
};

let styles = {
    chart: {
        height: 40
    }
};

export default class DashboardCharts extends React.Component {
    static propTypes = {
        stats: PropTypes.object,
        isPoker: PropTypes.bool,
        id: PropTypes.string
    };

    getDailyChartOptions() {
        let defaultOptions = JSON.parse(JSON.stringify(defaultChartOptions));
        defaultOptions.chart.type = 'area';
        defaultOptions.tooltip.formatter = function() {
            let result = `${formatter.formatDate(this.x)}`;
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatMoney(point.y)}`);
            }
            return `${points.join(' ')} (${result})`;
        };

        return defaultOptions;
    }

    getMonthlyChartOptions() {
        let defaultOptions = JSON.parse(JSON.stringify(defaultChartOptions));
        defaultOptions.chart.type = 'column';
        defaultOptions.tooltip.formatter = function() {
            let points = [];
            for (let point of this.points) {
                points.push(`<span style="color: ${point.color};">●</span>${formatter.formatMoney(point.y)}`);
            }
            return `${points.join(' ')} (${this.x})`;
        };

        return defaultOptions;
    }

    getDailyChart(metrics) {
        let data = this.props.id ? this.props.stats.daily[this.props.id] : this.props.stats.daily;
        if (!Object.keys(data)) {
            return (<div style={styles.chart}>No data</div>);
        }

        let options = this.getDailyChartOptions();
        options.tooltip.positioner = () => {
            return {x: 75, y: -25};
        };

        options.series = [];
        for (let singleMetrics of metrics) {
            if (singleMetrics == 'rakeAmount' && !this.props.isPoker) {
                continue;
            }
            let chartData = [];
            for (let date in data) {
                chartData.push({
                    x: formatter.toTimestamp(date),
                    y: Math.abs(data[date][singleMetrics] ? data[date][singleMetrics] / 100 : 0)
                });
            }
            options.series.push({
                name: translate(`dashboard.${singleMetrics}`),
                color: colorManager.getChartColor(singleMetrics),
                data: chartData
            });
        }

        return (
            <div style={styles.chart}>
                <ReactHighcharts config={options} />
            </div>
        );
    }

    getMonthlyChart(metrics) {
        let data = this.props.id ? this.props.stats.monthly[this.props.id] : this.props.stats.monthly;
        if (!Object.keys(data)) {
            return (<div style={styles.chart}>No data</div>);
        }

        let options = this.getMonthlyChartOptions();
        options.tooltip.positioner = () => {
            return {x: 75, y: -65 - gtTheme.theme.spacing.desktopGutterMini};
        };

        options.series = [];
        for (let singleMetrics of metrics) {
            if (singleMetrics == 'rakeAmount' && !this.props.isPoker) {
                continue;
            }
            let chartData = [];
            for (let date of Object.keys(data).reverse()) {
                chartData.push(Math.abs(data[date][singleMetrics] ? data[date][singleMetrics] / 100 : 0));
            }
            options.series.push({
                name: translate(`dashboard.${singleMetrics}`),
                color: colorManager.getChartColor(singleMetrics),
                data: chartData
            });
        }
        let categories = [];
        for (let date of Object.keys(data).reverse()) {
            categories.push(formatter.formatMonth(`${date}-01`));
        }
        options.xAxis.categories = categories;

        let style = JSON.parse(JSON.stringify(styles.chart));
        style.paddingTop = gtTheme.theme.spacing.desktopGutterMini;

        return (
            <div style={style}>
                <ReactHighcharts config={options} />
            </div>
        );
    }

    render() {
        return (
            <Tabs>
                <Tab label={<Translate content="dashboard.inout" />} style={gtTheme.theme.tab}>
                    {['paymentsAmount', 'depositsAmount', 'cashoutsAmount'].map((metrics) => {
                        return (
                            <div
                                key={metrics}
                                style={{
                                    color: colorManager.getChartColor(metrics),
                                    paddingTop: gtTheme.theme.spacing.desktopGutterMini
                                }}
                            >
                                <Translate content={`dashboard.${metrics}`} />
                                {this.getDailyChart([metrics])}
                                {this.getMonthlyChart([metrics])}
                            </div>
                        );
                    })}
                </Tab>
                <Tab label={<Translate content="dashboard.netgaming" />} style={gtTheme.theme.tab}>
                    {[['netgamingAmount', 'rakeAmount'], ['betsAmount'], ['winsAmount']].map((metrics) => {
                        return (
                            <div
                                key={metrics}
                                style={{
                                    color: colorManager.getChartColor(metrics[0]),
                                    paddingTop: gtTheme.theme.spacing.desktopGutterMini
                                }}
                            >
                                <Translate content={`dashboard.${metrics[0]}`} />
                                {this.getDailyChart(metrics)}
                                {this.getMonthlyChart(metrics)}
                            </div>
                        );
                    })}
                </Tab>
            </Tabs>
        );
    }
}
