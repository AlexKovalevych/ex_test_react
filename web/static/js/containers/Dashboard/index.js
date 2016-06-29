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

    componentDidMount() {
        console.log(this.props.stats.lastUpdated);
    }

    componentWillReceiveProps(newProps) {
        const { dispatch } = newProps;
        if (newProps.ws.channel && !newProps.stats.lastUpdated) {
            dispatch(dashboardActions.load());
        }
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

