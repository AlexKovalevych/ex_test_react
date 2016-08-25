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
import authActions from 'actions/auth';
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
        const { dispatch, user, ws, data } = props;
        if (ws.channels['users'] && (!data.lastUpdated || data.isOutdated)) {
            dispatch(dashboardActions.loadStats({period: user.settings.dashboardPeriod}));
        } else {
            dispatch(spinnerActions.stop());
        }
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
        const { dispatch } = this.props;
        dispatch(spinnerActions.start());
        dispatch(authActions.setDashboardCurrentPeriod(v));
    }

    onChangeComparisonPeriod(e, i, v) {
        const { dispatch } = this.props;
        dispatch(spinnerActions.start());
        dispatch(authActions.setDashboardComparisonPeriod(v));
    }

    onChangeSortMetrics(e, i ,v) {
        const { dispatch } = this.props;
        dispatch(authActions.setDashboardSort(v));
    }

    onChangeProjectsType(v) {
        const { dispatch } = this.props;
        dispatch(spinnerActions.start());
        dispatch(authActions.setDashboardProjectTypes(v));
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
                    return (<MenuItem key={i} value={-i - 1} primaryText={formatter.formatMonth(month.toDate())} style={gtTheme.theme.link} />);
                })}
            </SelectField>
        );
    }

    render() {
        let title = (
            <Title className="col-lg-4 col-md-4 col-xs-12">
                <Translate content="dashboard.title" />
            </Title>
        );
        if (!this.props.data.lastUpdated) {
            return (
                <div>{title}</div>
            );
        }

        if (!this.props.data.stats) {
            return (
                <div>{title}</div>
            );
        }

        let sortedStats = [];
        let sortBy = this.props.user.settings.dashboardSort;
        for (let projectId of Object.keys(this.props.data.stats)) {
            let value = formatter.formatChartValue(this.props.data.stats[projectId].current[sortBy], sortBy, false);
            if (value) {
                sortedStats.push([projectId, value]);
            }
        }
        sortedStats.sort((a, b) => {
            return b[1] - a[1];
        });

        let projectValues = [
            formatter.formatChartValue(this.props.data.totals.current[sortBy], sortBy, false),
            formatter.formatChartValue(this.props.data.totals.comparison[sortBy], sortBy, false)
        ];
        for (let key in this.props.data.stats) {
            if (Object.keys(this.props.data.stats[key].current).length !== 0) {
                projectValues.push(formatter.formatChartValue(this.props.data.stats[key].current[sortBy], sortBy, false));
            }
            if (Object.keys(this.props.data.stats[key].comparison).length !== 0) {
                projectValues.push(formatter.formatChartValue(this.props.data.stats[key].comparison[sortBy], sortBy, false));
            }
        }
        let maximumValue = Math.max.apply(null, projectValues);
        let projectsType = this.props.user.settings.dashboardProjectsType;
        let hasStats = Object.keys(this.props.data.stats).length > 0;

        return (
            <div>
                <div className="row">
                    {title}
                    <div className="col-lg-8 col-md-8 col-xs-12">
                        <div className="end-xs">
                            <span style={{marginRight: 12}}>
                                <Translate content="dashboard.project_types" />
                                <RaisedButton
                                    label={<Translate content="dashboard.projects.default" />}
                                    primary={projectsType == 'default'}
                                    style={styles}
                                    onClick={this.onChangeProjectsType.bind(this, 'default')}
                                />
                                <RaisedButton
                                    label={<Translate content="dashboard.projects.partner" />}
                                    primary={projectsType == 'partner'}
                                    style={styles}
                                    onClick={this.onChangeProjectsType.bind(this, 'partner')}
                                />
                            </span>
                            <SelectField
                                id="sortByMetrics"
                                value={this.props.user.settings.dashboardSort}
                                onChange={this.onChangeSortMetrics.bind(this)}
                                floatingLabelText={<Translate content="dashboard.sort_by_metrics" />}
                                style={{textAlign: 'left'}}
                            >
                                <MenuItem value="paymentsAmount" primaryText={<Translate content="dashboard.sort_by.paymentsAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="depositsAmount" primaryText={<Translate content="dashboard.sort_by.depositsAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="cashoutsAmount" primaryText={<Translate content="dashboard.sort_by.cashoutsAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="netgamingAmount" primaryText={<Translate content="dashboard.sort_by.netgamingAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="betsAmount" primaryText={<Translate content="dashboard.sort_by.betsAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="winsAmount" primaryText={<Translate content="dashboard.sort_by.winsAmount" />} style={gtTheme.theme.link} />
                                <MenuItem value="firstDepositsAmount" primaryText={<Translate content="dashboard.sort_by.firstDepositsAmount" />} style={gtTheme.theme.link} />
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
                                <MenuItem value="month" primaryText={<Translate content="dashboard.period.month" />} style={gtTheme.theme.link} />
                                <MenuItem value="year" primaryText={<Translate content="dashboard.period.year" />} style={gtTheme.theme.link} />
                                <MenuItem value="days30" primaryText={<Translate content="dashboard.period.last_30_days" />} style={gtTheme.theme.link} />
                                <MenuItem value="months12" primaryText={<Translate content="dashboard.period.last_12_months" />} style={gtTheme.theme.link} />
                            </SelectField>
                            {this.getComparisonPeriod()}
                        </div>
                    </div>
                </div>
                <div>
                    {
                        hasStats && ([
                            <Paper style={this.getStyles().block} key="total">
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
                            </Paper>,
                            sortedStats.map(this.renderProject.bind(this, maximumValue))
                        ])
                    }
                    {
                        !hasStats && (<div><Translate content="dashboard.no_data" /></div>)
                    }
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

