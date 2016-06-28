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

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(dashboardActions.load());
    }

    render() {
        return (<div>Dashboard here</div>);
    }
}

const mapStateToProps = (state) => {
    return state.dashboard;
};

export default connect(mapStateToProps)(Dashboard);

