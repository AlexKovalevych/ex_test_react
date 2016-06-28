import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import wsActions from '../../actions/ws';
// import { Dropdown } from 'react-bootstrap';
// import counterpart from 'counterpart';
// import Translate from 'react-translate-component';

class Dashboard extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func
    };

    componentDidLoad() {
        const { dispatch } = this.props;
        dispatch(wsActions.channel_join('dashboard'));
    }

    render() {
        return (<div></div>);
    }
}

const mapStateToProps = (state) => {
    return state.dashboard;
};

export default connect(mapStateToProps)(Dashboard);

