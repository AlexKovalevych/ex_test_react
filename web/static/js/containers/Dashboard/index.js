import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import dashboardActions from 'actions/dashboard';
import ConsolidatedTable from 'components/Dashboard/ConsolidatedTable';
import DashboardCharts from 'components/Dashboard/DashboardCharts';
// import { Dropdown } from 'react-bootstrap';
// import counterpart from 'counterpart';
// import Translate from 'react-translate-component';

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

    renderProject(project) {
        let projectStats = this.props.data.stats[project.id];
        if (Object.keys(projectStats.current).length == 0 || Object.keys(projectStats.comparison).length == 0) {
            return '';
        }
        return (
            <div key={project.id} className="col-sm-12">
                <div className="card">
                    <h5 className="card-header">{project.title}</h5>
                    <div className="card-block row">
                        <DashboardCharts stats={this.props.data.charts} />
                        <div className="col-lg-8">
                            <ConsolidatedTable
                                periods={this.props.data.periods}
                                stats={projectStats}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                {
                    this.props.data.lastUpdated && (
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card">
                                    <h5 className="card-header">Total</h5>
                                    <div className="card-block row">
                                        <DashboardCharts stats={this.props.data.charts} />
                                        <div className="col-lg-8">
                                            <ConsolidatedTable
                                                periods={this.props.data.periods}
                                                stats={this.props.data.totals}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.props.data.projects.map(this.renderProject.bind(this))}
                        </div>
                    )
                }
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

