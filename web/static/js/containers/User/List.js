import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import Title from 'components/Title';
import userActions from 'actions/user';
import spinnerActions from 'actions/spinner';
import Translate from 'react-translate-component';
import gtTheme from 'themes/indigo';

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

    render() {
        return (
            <div>
                <div className="row">
                    <Title title={<Translate content="menu.user" />} />
                    <table className="mdl-data-table table-lg" style={gtTheme.theme.table}>
                        <thead style={{tableLayout: 'auto'}}>
                            <tr>
                                <th style={{width: '5%'}}>#</th>
                                <th style={{width: '20%'}}><Translate content="user.email" /></th>
                                <th><Translate content="user.comment" /></th>
                                <th><Translate content="user.phone_number" /></th>
                                <th><Translate content="user.is_active" /></th>
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
                                        <td>{user.enabled}</td>
                                        <td>{user.lastLogin}</td>
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
        data: state.users,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(UserList);
