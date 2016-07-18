import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import authActions from '../../actions/auth';
import spacing from 'material-ui/styles/spacing';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ExitToAppIcon from 'material-ui/svg-icons/action/exit-to-app';
import IconButton from 'material-ui/IconButton';
import Translate from 'react-translate-component';

class App extends React.Component {
    static propTypes = {
        menu: PropTypes.object,
        main: PropTypes.object,
        children: PropTypes.object,
        dispatch: PropTypes.func,
        user: PropTypes.object,
        socket: PropTypes.object,
        channel: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    setLocale(e, i, locale) {
        const { dispatch } = this.props;
        dispatch(authActions.setLocale(locale));
    }

    onLogout(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(authActions.logout());
    }

    render() {
        return (
            <div>
                <div style={{paddingLeft: spacing.desktopKeylineIncrement * 4}}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <DropDownMenu value={this.props.user.locale} onChange={this.setLocale.bind(this)}>
                                <MenuItem
                                    value='ru'
                                    primaryText={<Translate content="ru" />}
                                    leftIcon={<img src="/images/flags/ru_2.png" width="25" />}
                                    label={
                                        <FlatButton
                                            label={<Translate content="ru" />}
                                            labelPosition="after"
                                            icon={<img src="/images/flags/ru_2.png" width="25" />}
                                        />
                                    }
                                />
                                <MenuItem
                                    value='en'
                                    primaryText={<Translate content="en" />}
                                    leftIcon={<img src="/images/flags/en_2.png" width="25" />}
                                    label={
                                        <FlatButton
                                            label={<Translate content="en" />}
                                            labelPosition="after"
                                            icon={<img src="/images/flags/en_2.png" width="25" />}
                                        />
                                    }
                                />
                            </DropDownMenu>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <IconButton onClick={this.onLogout.bind(this)}>
                                <ExitToAppIcon />
                            </IconButton>
                        </ToolbarGroup>
                    </Toolbar>
                    {this.props.main}
                </div>
                {this.props.menu}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    socket: state.auth.socket,
    channel: state.auth.channel
});

export default connect(mapStateToProps)(App);
