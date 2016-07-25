import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import dashboardActions from 'actions/dashboard';
import ConsolidatedTable from './ConsolidatedTable';
import DashboardCharts from './DashboardCharts';
import DashboardProgress from 'components/Dashboard/DashboardProgress';
import Translate from 'react-translate-component';
import gtTheme from 'themes';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import Title from 'components/Title';
import spinnerActions from 'actions/spinner';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import formatter from 'managers/Formatter';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    marginTop: 12,
    marginBottom: 12
};

class Dashboard extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        data: PropTypes.object,
        user: PropTypes.object
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    loadData(props) {
        const { dispatch } = props;
        if (props.ws.channel && !props.data.lastUpdated) {
            dispatch(dashboardActions.loadStats({period: this.props.user.settings.dashboardPeriod}));
        } else {
            dispatch(spinnerActions.stop());
        }
        // if (props.ws.channel && !props.data.charts) {
        //     dispatch(dashboardActions.loadCharts({period: this.props.user.settings.dashboardPeriod}));
        // }
    }

    componentDidMount() {
        this.loadData(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    getStyles() {
        return {
            block: {
                marginTop: gtTheme.theme.spacing.desktopGutter,
                padding: gtTheme.theme.spacing.desktopGutterLess
            }
        };
    }

    renderProject(maximumValue, data) {
        let projectId = data[0];
        let project;
        for (let projectData of this.props.data.projects) {
            if (projectData.id == projectId) {
                project = projectData;
                break;
            }
        }
        let projectStats = this.props.data.stats[projectId];
        if (Object.keys(projectStats.current).length == 0 || Object.keys(projectStats.comparison).length == 0) {
            return '';
        }

        return (
            <Paper key={projectId} style={this.getStyles().block}>
                <Subheader>{project.title}</Subheader>
                <div className='row'>
                    <div className='col-lg-4 col-md-4 col-xs-12'>
                        <DashboardProgress
                            sortBy={this.props.user.settings.dashboardSort}
                            periods={this.props.data.periods}
                            stats={projectStats}
                            periodType={this.props.user.settings.dashboardPeriod}
                            maximumValue={maximumValue}
                        />
                        {
                            this.props.data.charts && (
                                <DashboardCharts stats={this.props.data.charts.stats} id={projectId} isPoker={project.isPoker} />
                            )
                        }
                    </div>
                    <div className='col-lg-8 col-md-8 col-xs-12'>
                        <ConsolidatedTable
                            periodType={this.props.user.settings.dashboardPeriod}
                            periods={this.props.data.periods}
                            stats={projectStats}
                            chart={this.props.data.consolidatedChart}
                            id={projectId}
                        />
                    </div>
                </div>
            </Paper>
        );
    }

    onChangeCurrentPeriod(e, i, v) {
        console.log(e,i,v);
    }

    onChangeComparisonPeriod(e, i, v) {
        console.log(e,i,v);
    }

    onChangeSortMetrics(e, i ,v) {
        console.log(e, i, v);
    }

    onChangeProjectsType(e, i, v) {
        console.log(e, i, v);
    }

    getComparisonPeriod() {
        if (this.props.user.settings.dashboardPeriod != 'month') {
            return '';
        }

        let now = moment();
        let months = [];
        for (let i of [...Array(6).keys()]) {
            months.push(now.clone().subtract(i + 1, 'months'));
        }

        return (
            <SelectField
                id="comparisonPeriod"
                value={this.props.user.settings.dashboardComparePeriod}
                onChange={this.onChangeComparisonPeriod.bind(this)}
                floatingLabelText={<Translate content="dashboard.comparison_period" />}
                style={{textAlign: 'left'}}
            >
                {months.map((month, i) => {
                    return (<MenuItem key={i} value={-i - 1} primaryText={formatter.formatMonth(month.toDate())} />);
                })}
            </SelectField>
        );
    }

    render() {
        let title = (<Title className="col-lg-4 col-md-4 col-xs-12" title={<Translate content="dashboard.title" />} />);
        if (!this.props.data.lastUpdated) {
            return (
                <div>{title}</div>
            );
        }

        let sortedStats = [];
        let sortBy = this.props.user.settings.dashboardSort;
        for (let projectId of Object.keys(this.props.data.stats)) {
            let value = this.props.data.stats[projectId].current[sortBy];
            if (value) {
                sortedStats.push([projectId, value]);
            }
        }
        sortedStats.sort((a, b) => {
            return b[1] - a[1];
        });

        let projectValues = [this.props.data.totals.current[sortBy], this.props.data.totals.comparison[sortBy]];
        for (let key in this.props.data.stats) {
            if (Object.keys(this.props.data.stats[key].current).length !== 0) {
                projectValues.push(this.props.data.stats[key].current[sortBy]);
            }
            if (Object.keys(this.props.data.stats[key].comparison).length !== 0) {
                projectValues.push(this.props.data.stats[key].comparison[sortBy]);
            }
        }
        let maximumValue = Math.max.apply(null, projectValues);

        return (
            <div className="row">
                {title}
                <div className="col-lg-8 col-md-8 col-xs-12">
                    <div className="end-xs">
                        <span style={{marginRight: 12}}>
                            <Translate content="dashboard.project_types" />
                            <RaisedButton label={<Translate content="dashboard.projects.default" />} primary={true} style={styles} />
                            <RaisedButton label={<Translate content="dashboard.projects.partner" />} style={styles} />
                        </span>
                        <SelectField
                            id="sortByMetrics"
                            value={this.props.user.settings.dashboardSort}
                            onChange={this.onChangeSortMetrics.bind(this)}
                            floatingLabelText={<Translate content="dashboard.sort_by_metrics" />}
                            style={{textAlign: 'left'}}
                        >
                            <MenuItem value="paymentsAmount" primaryText={<Translate content="dashboard.sort_by.paymentsAmount" />} />
                            <MenuItem value="depositsAmount" primaryText={<Translate content="dashboard.sort_by.depositsAmount" />} />
                            <MenuItem value="cashoutsAmount" primaryText={<Translate content="dashboard.sort_by.cashoutsAmount" />} />
                            <MenuItem value="netgamingAmount" primaryText={<Translate content="dashboard.sort_by.netgamingAmount" />} />
                            <MenuItem value="betsAmount" primaryText={<Translate content="dashboard.sort_by.betsAmount" />} />
                            <MenuItem value="winsAmount" primaryText={<Translate content="dashboard.sort_by.winsAmount" />} />
                            <MenuItem value="firstDepositsAmount" primaryText={<Translate content="dashboard.sort_by.firstDepositsAmount" />} />
                        </SelectField>
                    </div>
                    <div className="end-xs">
                        <SelectField
                            id="currentPeriod"
                            value={this.props.user.settings.dashboardPeriod}
                            onChange={this.onChangeCurrentPeriod.bind(this)}
                            floatingLabelText={<Translate content="dashboard.current_period" />}
                            style={{textAlign: 'left'}}
                        >
                            <MenuItem value="month" primaryText={<Translate content="dashboard.period.month" />} />
                            <MenuItem value="year" primaryText={<Translate content="dashboard.period.year" />} />
                            <MenuItem value="monthPeriod" primaryText={<Translate content="dashboard.period.last_30_days" />} />
                            <MenuItem value="yearPeriod" primaryText={<Translate content="dashboard.period.last_12_months" />} />
                        </SelectField>
                        {this.getComparisonPeriod()}
                    </div>
                </div>
                <div>
                    <Paper style={this.getStyles().block}>
                        <Subheader>Total</Subheader>
                        <div className='row'>
                            <div className='col-lg-4 col-md-4 col-xs-12'>
                                <DashboardProgress
                                    sortBy={this.props.user.settings.dashboardSort}
                                    periods={this.props.data.periods}
                                    stats={this.props.data.totals}
                                    periodType={this.props.user.settings.dashboardPeriod}
                                    maximumValue={maximumValue}
                                />
                                {
                                    this.props.data.charts && (
                                        <DashboardCharts stats={this.props.data.charts.totals} />
                                    )
                                }
                            </div>
                            <div className='col-lg-8 col-md-8 col-xs-12'>
                                <ConsolidatedTable
                                    periodType={this.props.user.settings.dashboardPeriod}
                                    periods={this.props.data.periods}
                                    stats={this.props.data.totals}
                                    chart={this.props.data.consolidatedChart}
                                />
                            </div>
                        </div>
                    </Paper>
                    {sortedStats.map(this.renderProject.bind(this, maximumValue))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        data: state.dashboard,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(Dashboard);

