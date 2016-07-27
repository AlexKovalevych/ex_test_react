import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import errorActions from 'actions/error';

class ErrorSnackbar extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        isOpened: PropTypes.bool,
        message: PropTypes.string
    };

    onClose() {
        const { dispatch } = this.props;
        dispatch(errorActions.hide());
    }

    render() {
        if (this.props.isOpened) {
            return (
                <Snackbar
                    open={this.props.isOpened}
                    message={this.props.message}
                    autoHideDuration={4000}
                    onRequestClose={this.onClose.bind(this)}
                />
            );
        }
        return false;
    }
}

const mapStateToProps = (state) => {
    return {
        message: state.error.message,
        isOpened: state.error.isOpened
    };
};

export default connect(mapStateToProps)(ErrorSnackbar);
