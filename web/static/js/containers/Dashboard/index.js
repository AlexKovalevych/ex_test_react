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
        data: PropTypes.object
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    loadData(props) {
        const { dispatch } = props;
        if (props.ws.channel && !props.data.lastUpdated) {
            dispatch(dashboardActions.loadStats());
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
        let currentPeriod = Object.keys(projectStats)[1];
        let previousPeriod = Object.keys(projectStats)[0];
        if (Object.keys(projectStats[currentPeriod]).length == 0 || Object.keys(projectStats[previousPeriod]).length == 0) {
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
                                project={project}
                                currentPeriod={currentPeriod}
                                previousPeriod={previousPeriod}
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
                <div className="row">
                    {this.props.data.projects.map(this.renderProject.bind(this))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.dashboard,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(Dashboard);

