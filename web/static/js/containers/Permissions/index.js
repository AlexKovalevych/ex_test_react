import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import spinnerActions from 'actions/spinner';
import permissionActions from 'actions/permissions';
import Translate from 'react-translate-component';
import Title from 'components/Title';

class PermissionsIndex extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func,
        data: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            permissions: null
        };
    }

    loadData(props, update=false) {
        const {dispatch, ws} = props;
        if (ws.channel && update) {
            dispatch(permissionActions.load());
        } else {
            dispatch(spinnerActions.stop());
        }
        if (!props.errors && props.data) {
            this.setState({permissions: props.data});
        }
    }

    componentDidMount() {
        this.loadData(this.props, true);
    }

    componentWillReceiveProps(newProps) {
        this.loadData(newProps);
    }

    getTitle() {
        return (
            <Title>
                <Translate content="menu.permissions" />
            </Title>
        );
    }

    render() {
        if (!this.state.permissions) {
            return (
                <div>
                    <div className="row">
                        {this.getTitle()}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <div className="row">
                    {this.getTitle()}
                    <form className="row" style={{width: '100%'}}>
                    </form>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        data: state.permissions,
        ws: state.ws
    };
};

export default connect(mapStateToProps)(PermissionsIndex);
