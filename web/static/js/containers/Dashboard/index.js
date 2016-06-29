import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import dashboardActions from '../../actions/dashboard';
// import { Dropdown } from 'react-bootstrap';
// import counterpart from 'counterpart';
// import Translate from 'react-translate-component';

class Dashboard extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func
    };

    static contextTypes = {
        store: React.PropTypes.object.isRequired
    };

    loadData(props) {
        const { dispatch } = props;
        if (props.ws.channel && !props.stats.lastUpdated) {
            dispatch(dashboardActions.load());
        }
    }

    componentDidMount() {
        this.loadData(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    render() {
        return (<div>Dashboard here</div>);
    }
}

const mapStateToProps = (state) => {
    return {
        stats: state.dashboard,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(Dashboard);

