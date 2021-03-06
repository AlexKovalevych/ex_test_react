import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Title from 'components/Title';
import userActions from 'actions/user';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import gtTheme from 'themes/indigo';
import formatter from 'managers/Formatter';
import FontIcon from 'material-ui/FontIcon';
import Pagination from 'components/Pagination';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { push } from 'react-router-redux';

const styles = {
    icon: {
        fontSize: 16,
        fontWeight: 'bold',
        float: 'left'
    }
};

class UserList extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        data: PropTypes.object
    };

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channels['admins'] && update) {
            dispatch(userActions.loadUsers({
                page: this.props.data.currentPage,
                search: this.props.data.search
            }));
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

    showEnabled(value) {
        if (value) {
            return (
                <span>
                    <FontIcon className="material-icons success" style={styles.icon}>done</FontIcon>
                    <Translate content="yes" />
                </span>
            );
        }
        return (
            <span>
                <FontIcon className="material-icons error" style={styles.icon}>clear</FontIcon>
                <Translate content="no" />
            </span>
        );
    }

    onChangePage(page) {
        const { dispatch } = this.props;
        dispatch(userActions.loadUsers({
            page: page,
            search: this.props.data.search
        }));
    }

    createUser() {
        const { dispatch } = this.props;
        dispatch(push('/settings/user/create'));
    }

    editUser(id) {
        const { dispatch } = this.props;
        dispatch(push(`/settings/user/edit/${id}`));
    }

    onSearchUser(e) {
        const {dispatch} = this.props;
        if (e.target.value.length >= 3) {
            dispatch(userActions.loadUsers({
                page: 1,
                search: e.target.value
            }));
        }
        if (e.target.value.length == 0) {
            dispatch(userActions.loadUsers({
                page: 1,
                search: null
            }));
        }
    }

    render() {
        let title = (<Title><Translate content="menu.user" /></Title>);
        if (!this.props.data.lastUpdated) {
            return (
                <div>{title}</div>
            );
        }

        return (
            <div>
                <div className="row">
                    {title}
                    <div className="row middle-xs" style={{width: '100%'}}>
                        <div className="col-xs-6">
                            <FloatingActionButton secondary={true} mini={true} onClick={this.createUser.bind(this)}>
                                <FontIcon className="material-icons">add</FontIcon>
                            </FloatingActionButton>
                        </div>
                        <div className="col-xs-6 end-xs">
                            <TextField
                                id="search"
                                onChange={this.onSearchUser.bind(this)}
                                hintText={<Translate content="user.email" />}
                                floatingLabelText={<Translate content="search" />}
                            />
                        </div>
                    </div>
                    <table className="mdl-data-table table-lg" style={gtTheme.theme.table}>
                        <thead style={{tableLayout: 'auto'}}>
                            <tr>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '20%'}}><Translate content="user.email" /></th>
                                <th style={{width: '30%'}}><Translate content="user.comment" /></th>
                                <th style={{width: '15%'}}><Translate content="user.phone_number" /></th>
                                <th style={{width: '10%'}}><Translate content="user.is_active" /></th>
                                <th><Translate content="user.last_online" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.users.map((user, i) => {
                                return (
                                    <tr key={i} onClick={this.editUser.bind(this, user.id)} style={gtTheme.theme.link}>
                                        <td style={{width: '5%'}}>{(this.props.data.currentPage - 1) * 10 + i + 1}</td>
                                        <td style={{width: '20%'}}>{user.email}</td>
                                        <td>{user.description}</td>
                                        <td>{user.securePhoneNumber}</td>
                                        <td>{this.showEnabled(user.enabled)}</td>
                                        <td>{formatter.formatTime(user.lastLogin)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="col-xs-12" style={{textAlign: 'center'}}>
                        <Pagination
                            initialSelected={this.props.data.currentPage - 1}
                            totalPages={this.props.data.totalPages}
                            clickCallback={this.onChangePage.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.users,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserList);
