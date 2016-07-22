import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import modalActions from 'actions/modal';

const styles = {
    width: '75%',
    maxWidth: 'none'
};

class Modal extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        options: PropTypes.object,
        isOpened: PropTypes.bool
    };

    closeDialog() {
        const { dispatch } = this.props;
        dispatch(modalActions.closeModal());
    }

    getTitle() {
        return this.props.options ? this.props.options.title : '';
    }

    render() {
        return (
            <Dialog
                title={this.getTitle()}
                modal={false}
                open={this.props.isOpened}
                onRequestClose={this.closeDialog.bind(this)}
                contentStyle={styles}
            ></Dialog>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isOpened: state.modal.isOpened,
        options: state.modal.options,
        consolidatedChart: state.modal.consolidatedChart
    };
};

export default connect(mapStateToProps)(Modal);
