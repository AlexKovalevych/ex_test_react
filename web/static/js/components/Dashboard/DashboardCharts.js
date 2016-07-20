import React, {PropTypes} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Translate from 'react-translate-component';
import gtTheme from 'themes';
import ReactHighstock from 'react-highcharts/dist/ReactHighstock.src';
import formatter from 'managers/Formatter';
import colorManager from 'managers/ColorManager';
import translate from 'counterpart';

let defaultChartOptions = {
    chart: {
        backgroundColor: null,
        borderWidth: 0,
        type: 'area',
        margin: [2, 0, 2, 0],
        style: {
            overflow: 'visible'
        },
        skipClone: true
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

export default class DashboardCharts extends React.Component {
    static propTypes = {
        stats: PropTypes.object,
        id: PropTypes.string
    };

    getDailyChartOptions() {
        let defaultOptions = JSON.parse(JSON.stringify(defaultChartOptions));
        defaultOptions.chart.type = 'area';
        defaultOptions.tooltip.formatter = function() {
            let result = `${formatter.formatDate(this.x)}`;
            let points = [];
            $.each(this.points, function() {
                points.push(`<span style="color: ${this.color};">●</span>${formatter.formatMoney(this.y)}`);
            });

            return `${points.join(' ')} (${result})`;
        };

        return defaultOptions;
    }

    getDailyChart(metrics) {
        let projectData = this.props.stats.daily[this.props.id];
        if (!Object.keys(projectData)) {
            return (<div>No data</div>);
        }

        let options = this.getDailyChartOptions();

        options.series = [];
        for (let singleMetrics of metrics) {
            let chartData = [];
            for (let date in projectData) {
                options.series.push({
                    x: projectData[date][singleMetrics],
                    y: date // TODO: convert to timestamp
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
        let loadingIcon;
        if (!this.props.stats) {
            loadingIcon = (<i className="fa fa-cog fa-spin"></i>);
        }

        return (
            <Tabs>
                <Tab label={<Translate content="dashboard.inout" />} style={gtTheme.theme.tab}>
                    {this.getDailyChart(['paymentsAmount'])}
                </Tab>
                <Tab label={<Translate content="dashboard.netgaming" />} style={gtTheme.theme.tab}>
                    {loadingIcon}
                </Tab>
            </Tabs>
        );
    }
}
