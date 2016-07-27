import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import authActions from 'actions/auth';
import menuActions from 'actions/menu';
import gtTheme from 'themes';
import FlatButton from 'material-ui/FlatButton';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Translate from 'react-translate-component';
import Modal from 'containers/Modal';
import Spinner from 'components/Spinner';
import ErrorSnackbar from 'containers/ErrorSnackbar';

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

    onToggleMenu(e) {
        e.preventDefault();
        const { dispatch } = this.props;
        dispatch(menuActions.toggle());
    }

    render() {
        const styles = {
            iconStyles: {
                color: gtTheme.theme.palette.alternateTextColor
            },
            iconButtonStyle: {
                height: gtTheme.theme.toolbar.height,
                width: gtTheme.theme.toolbar.height
            }
        };

        return (
            <div>
                {this.props.menu}
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <IconButton
                            onClick={this.onToggleMenu.bind(this)}
                            style={styles.iconButtonStyle}
                            iconStyle={styles.iconStyles}
                        >
                            <FontIcon className="material-icons">view_headline</FontIcon>
                        </IconButton>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <DropDownMenu
                            value={this.props.user.locale}
                            onChange={this.setLocale.bind(this)}
                        >
                            <MenuItem
                                value='ru'
                                primaryText={<Translate content="ru" />}
                                leftIcon={<img src="/images/flags/ru_2.png" width="25" />}
                                label={
                                    <FlatButton
                                        style={styles.iconStyles}
                                        label={<Translate content="ru" />}
                                        labelPosition="after"
                                        icon={<img src="/images/flags/ru_2.png" width="25" />}
                                    />
                                }
                                style={gtTheme.theme.link}
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
                                        style={styles.iconStyles}
                                    />
                                }
                                style={gtTheme.theme.link}
                            />
                        </DropDownMenu>
                        <IconButton
                            onClick={this.onLogout.bind(this)}
                            style={styles.iconButtonStyle}
                            iconStyle={styles.iconStyles}
                        >
                            <FontIcon className="material-icons">exit_to_app</FontIcon>
                        </IconButton>
                    </ToolbarGroup>
                </Toolbar>
                <div style={{padding: gtTheme.theme.spacing.desktopGutter}}>
                    {this.props.main}
                </div>
                <Modal />
                <Spinner />
                <ErrorSnackbar />
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
