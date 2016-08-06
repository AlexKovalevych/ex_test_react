import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import userActions from 'actions/user';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import Title from 'components/Title';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { push } from 'react-router-redux';

const styles = {
    backButton: {marginRight: 15}
};

class UserEdit extends React.Component {
    static propTypes = {
        data: PropTypes.object,
        params: PropTypes.object,
        dispatch: PropTypes.func
    };

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channel && update && this.props.params.id) {
            dispatch(userActions.loadUser(this.props.params.id));
        } else {
            dispatch(spinnerActions.stop());
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    goToListPage() {
        const {dispatch} = this.props;
        dispatch(push('/settings/user/list'));
    }

    getTitle() {
        let crumb;
        if (!this.props.data && !this.props.params.id) {
            crumb = (<Translate content="user.new" />);
        }

        if (this.props.data && this.props.params.id) {
            crumb = (<Translate content="user.edit" email={this.props.data.email} />) ;
        }
        return (
            <Title>
                <FloatingActionButton secondary={true} mini={true} onClick={this.goToListPage.bind(this)} style={styles.backButton}>
                    <FontIcon className="material-icons">keyboard_arrow_left</FontIcon>
                </FloatingActionButton>
                {crumb}
            </Title>
        );
    }

    render() {
        return (
            <div>
                <div className="row">
                    {this.getTitle()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        data: state.users.user,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserEdit);
