import React from 'react';
import { connect } from 'react-redux';
import Title from 'components/Title';

class UserList extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <Title title="menu.users" />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    };
};

export default connect(mapStateToProps)(UserList);
