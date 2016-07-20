import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import dashboardActions from 'actions/dashboard';
import ConsolidatedTable from 'components/Dashboard/ConsolidatedTable';
import DashboardCharts from 'components/Dashboard/DashboardCharts';
import DashboardProgress from 'components/Dashboard/DashboardProgress';
import Translate from 'react-translate-component';
import gtTheme from 'themes';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import Title from 'components/Title';

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
            dispatch(dashboardActions.loadCharts());
        }
    }

    componentDidMount() {
        this.loadData(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
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
            <Paper key={projectId} style={{marginTop: gtTheme.theme.content.padding}}>
                <Subheader>{project.title}</Subheader>
                <div className='row'>
                    <div className='col-md-4 col-xs-12'>
                        <DashboardProgress
                            sortBy={this.props.user.settings.dashboardSort}
                            periods={this.props.data.periods}
                            stats={projectStats}
                            periodType={this.props.user.settings.dashboardPeriod}
                            maximumValue={maximumValue}
                        />
                        <DashboardCharts stats={this.props.data.charts.stats} id={projectId} />
                    </div>
                    <div className='col-md-8 col-xs-12'>
                        <ConsolidatedTable
                            periodType={this.props.user.settings.dashboardPeriod}
                            periods={this.props.data.periods}
                            stats={projectStats}
                        />
                    </div>
                </div>
            </Paper>
        );
    }

    render() {
        let title = (<Title title={<Translate content="dashboard.title" />} />);
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
            <div>
                {title}
                <div>
                    <Paper style={{marginTop: gtTheme.theme.content.padding}}>
                        <Subheader>Total</Subheader>
                        <div className='row'>
                            <div className='col-md-4 col-xs-12'>
                                <DashboardProgress
                                    sortBy={this.props.user.settings.dashboardSort}
                                    periods={this.props.data.periods}
                                    stats={this.props.data.totals}
                                    periodType={this.props.user.settings.dashboardPeriod}
                                    maximumValue={maximumValue}
                                />
                            </div>
                            <div className='col-md-8 col-xs-12'>
                                <ConsolidatedTable
                                    periodType={this.props.user.settings.dashboardPeriod}
                                    periods={this.props.data.periods}
                                    stats={this.props.data.totals}
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
                                // <DashboardCharts stats={this.props.data.charts.totals} />

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        data: state.dashboard,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(Dashboard);

