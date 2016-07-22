import React from 'react';
import { connect } from 'react-redux';
import spinnerActions from 'actions/spinner';

class Timeline extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(spinnerActions.stop());
    }

    render() {
        return (
            <div>Timeline report</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};

export default connect(mapStateToProps)(Timeline);
