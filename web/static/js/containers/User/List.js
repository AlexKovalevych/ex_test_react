import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Title from 'components/Title';
import userActions from 'actions/user';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import gtTheme from 'themes/indigo';
import formatter from 'managers/Formatter';
import FontIcon from 'material-ui/FontIcon';

const styles = {
    icon: {
        fontSize: 16,
        fontWeight: 'bold',
        float: 'left'
    }
};

class UserList extends React.Component {
    static propTypes = {
        data: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            search: null
        };
    }

    loadData(props, update=false) {
        const { dispatch, ws } = props;
        if (ws.channel && update) {
            dispatch(userActions.loadUsers({
                page: this.state.page,
                search: this.state.search
            }));
        } else {
            dispatch(spinnerActions.stop());
        }
    }

    componentDidMount() {
        this.loadData(this.props);
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

    render() {
        let title = (<Title title={<Translate content="menu.user" />} />);
        if (!this.props.data.lastUpdated) {
            return (
                <div>{title}</div>
            );
        }

        return (
            <div>
                <div className="row">
                    {title}
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
                                    <tr key={i}>
                                        <td style={{width: '5%'}}>{(this.props.data.page - 1) * 10 + i + 1}</td>
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        data: state.users,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserList);
