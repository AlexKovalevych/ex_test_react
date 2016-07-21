import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
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
        height: 40,
        textAlign: 'center'
    }
};

const RATE_LIMIT = 25;

export default class DashboardCharts extends React.Component {
    static propTypes = {
        stats: PropTypes.object,
        isPoker: PropTypes.bool,
        id: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    componentDidMount() {
        if (typeof window === 'undefined') {
            return;
        }

        if (!this._dom_node) {
            this._dom_node = ReactDOM.findDOMNode(this);
        }
        let domNode = this._dom_node;

        this._rcv_fn = () => {
            if (this._rcv_lock) {
                this._rcv_schedule = true;
                return;
            }
            this._rcv_lock = true;
            this.checkComponentVisibility();
            this._rcv_timeout = setTimeout(() => {
                this._rcv_lock = false;
                if (this._rcv_schedule) {
                    this._rcv_schedule = false;
                    this.checkComponentVisibility();
                }
            }, RATE_LIMIT);
        };

        /* Adding scroll listeners to all element's parents */
        while (domNode.nodeName !== 'BODY' && domNode.parentElement) {
            domNode = domNode.parentElement;
            domNode.addEventListener('scroll', this._rcv_fn);
        }
        /* Adding listeners to page events */
        document.addEventListener('visibilitychange', this._rcv_fn);
        document.addEventListener('scroll', this._rcv_fn);
        window.addEventListener('resize', this._rcv_fn);

        this._rcv_fn();
    }

    componentWillUnmount() {
        this.disableVisibilityHandling();
    }

    checkComponentVisibility() {
        let domNode = this._dom_node,
            gcs = window.getComputedStyle(domNode, false),
            dims = domNode.getBoundingClientRect(),
            h = window.innerHeight,
            w = window.innerWidth,
            // are we vertically visible?
            topVisible = 0 < dims.top && dims.top < h,
            bottomVisible = 0 < dims.bottom && dims.bottom < h,
            verticallyVisible = topVisible || bottomVisible,
            // also, are we horizontally visible?
            leftVisible = 0 < dims.left && dims.left < w,
            rightVisible = 0 < dims.right && dims.right < w,
            horizontallyVisible = leftVisible || rightVisible,
            // we're only visible if both of those are true.
            visible = horizontallyVisible && verticallyVisible;

        // but let's be fair: if we're opacity: 0 or
        // visibility: hidden, or browser window is minimized we're not visible at all.
        if (visible) {
            let isDocHidden = document.hidden;
            let isElementNotDisplayed = (gcs.getPropertyValue('display') === 'none');
            let elementHasZeroOpacity = (gcs.getPropertyValue('opacity') === 0);
            let isElementHidden = (gcs.getPropertyValue('visibility') === 'hidden');
            visible = visible && !(isDocHidden || isElementNotDisplayed || elementHasZeroOpacity || isElementHidden);
        }

        // at this point, if our visibility is not what we expected,
        // update our state so that we can trigger whatever needs to
        // happen.
        if (visible !== this.state.visible) {
            this.setState({isVisible: visible});
        }
    }

    disableVisibilityHandling() {
        clearTimeout(this._rcv_timeout);
        if (this._rcv_fn) {
            let domNode = this._dom_node;
            while (domNode.nodeName !== 'BODY' && domNode.parentElement) {
                domNode = domNode.parentElement;
                domNode.removeEventListener('scroll', this._rcv_fn);
            }

            document.removeEventListener('visibilitychange', this._rcv_fn);
            document.removeEventListener('scroll', this._rcv_fn);
            window.removeEventListener('resize', this._rcv_fn);
            this._rcv_fn = false;
        }
    }

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
        if (!this.state.isVisible) {
            return (<div style={styles.chart}></div>);
        }

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
        let style = JSON.parse(JSON.stringify(styles.chart));
        style.paddingTop = gtTheme.theme.spacing.desktopGutterMini;
        if (!this.state.isVisible) {
            return (<div style={style}></div>);
        }

        let data = this.props.id ? this.props.stats.monthly[this.props.id] : this.props.stats.monthly;
        if (!Object.keys(data)) {
            return (<div style={style}>No data</div>);
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

        return (
            <div style={style}>
                <ReactHighcharts config={options} />
            </div>
        );
    }

    render() {
        if (this.state.isVisible) {
            this.disableVisibilityHandling();
        }

        return (
            <Tabs>
                <Tab label={<Translate content="dashboard.inout" />} style={gtTheme.theme.tab}>
                    {
                        ['paymentsAmount', 'depositsAmount', 'cashoutsAmount'].map((metrics) => {
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
                        })
                    }
                </Tab>
                <Tab label={<Translate content="dashboard.netgaming" />} style={gtTheme.theme.tab}>
                    {
                        [['netgamingAmount', 'rakeAmount'], ['betsAmount'], ['winsAmount']].map((metrics) => {
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
                        })
                    }
                </Tab>
            </Tabs>
        );
    }
}
