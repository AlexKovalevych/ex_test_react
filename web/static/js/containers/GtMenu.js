import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { push } from 'react-router-redux';
import AccountBalanceIcon from 'material-ui/svg-icons/action/account-balance';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import EventIcon from 'material-ui/svg-icons/action/event';
import AccountBoxIcon from 'material-ui/svg-icons/action/account-box';
import ShowChartIcon from 'material-ui/svg-icons/editor/show-chart';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const styles = {
    title: {
        cursor: 'pointer'
    },
    menu: {
        cursor: 'pointer'
    }
};

const ICONS = {
    dashboard: DashboardIcon,
    finance: AccountBalanceIcon,
    statistics: ShowChartIcon,
    calendar_events: EventIcon,
    players: AccountBoxIcon,
    settings: SettingsIcon
};

const MENU_ORDER = [
    'dashboard',
    'finance',
    'statistics',
    'calendar_events',
    'players',
    'settings'
];

class GtMenu extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        location: PropTypes.object,
        dispatch: PropTypes.func
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null
        };
    }

    handleTouchTap() {
        const { dispatch } = this.props;
        dispatch(push('/'));
    }

    getSelectedItem() {
        for (let group of Object.keys(this.props.user.permissions)) {
            for (let item of Object.keys(this.props.user.permissions[group])) {
                if (this.isSelectedItem(this.getUrl(group, item))) {
                    return group == 'dashboard' ? 'dashboard' : item;
                }
            }
        }
    }

    componentWillMount() {
        this.setState({selectedItem: this.getSelectedItem()});
    }

    getUrl(block, node) {
        if (node == 'dashboard_index') {
            return '/';
        }
        return `/${block}/${node}`;
    }

    isSelectedItem(block) {
        return this.context.router.isActive(block) || (block == 'dashboard' && this.props.location.pathname == '/');
    }

    setSelectedItem(item) {
        this.setState({selectedItem: item.id});
    }

    changeUrl(url) {
        const {dispatch} = this.props;
        dispatch(push(url));
    }

    getGroupChildren(block) {
        let parentBlock = this.props.user.permissions[block];
        let permissions = Object.keys(parentBlock).filter((node) => {
            return parentBlock[node].length > 0;
        });
        if (permissions.length < 2) {
            return [];
        }

        let navi = [];
        for (let node of permissions) {
            navi.push({
                id: node,
                text: node,
                url: this.getUrl(block, node)
            });
        }
        return navi;
    }

    getSettingsChildren() {
        let navi = [];
        for (let node of ['users', 'projects', 'notifications', 'permissions', 'data_sources', 'smtp_servers']) {
            navi.push({
                id: node,
                text: node,
                url: this.getUrl('settings', node)
            });
        }
        return navi;
    }

    render() {
        let permissions = Object.keys(this.props.user.permissions).filter((block) => {
            let parentBlock = this.props.user.permissions[block];
            let children = Object.keys(parentBlock).filter((node) => {
                return parentBlock[node].length > 0;
            });
            return children.length > 0;
        });

        let navi = [];
        for (let group of permissions) {
            if (group == 'dashboard') {
                navi.push({
                    id: group,
                    text: group,
                    icon: ICONS[group],
                    url: this.getUrl(group, 'dashboard_index'),
                    navlist: this.getGroupChildren(group)
                });
            } else {
                navi.push({
                    id: group,
                    text: group,
                    icon: ICONS[group],
                    navlist: this.getGroupChildren(group)
                });
            }
        }

        if (this.props.user.is_admin) {
            let group = 'settings';
            navi.push({
                id: group,
                text: group,
                icon: ICONS[group],
                navlist: this.getSettingsChildren()
            });
        }

        navi.sort((a, b) => {
            return MENU_ORDER.indexOf(a.id) - MENU_ORDER.indexOf(b.id);
        });

        return (
            <Drawer open={true} docked={true}>
                <AppBar
                    title={<span style={styles.title}>Globotunes 3.0</span>}
                    onTitleTouchTap={this.handleTouchTap.bind(this)}
                    iconElementLeft={<img src="/images/logo.png" width="50" height="50" />}
                />
                {navi.map((group) => {
                    let props = {
                        style: Object.assign({}, styles.menu),
                        leftIcon: React.createElement(group.icon),
                        key: group.id,
                        primaryText: group.text
                    };
                    if (group.navlist.length > 0) {
                        props.rightIcon = (<ArrowDropRight />);
                        props.menuItems = [];
                        group.navlist.map((child) => {
                            props.menuItems.push(
                                <MenuItem
                                    primaryText={child.text}
                                    onClick={this.changeUrl.bind(this, child.url)}
                                    style={styles.title}
                                />
                            );
                        });
                    } else {
                        props.onClick = this.changeUrl.bind(this, group.url);
                    }
                    if (this.isSelectedItem(group.id)) {
                        props.style.backgroundColor = getMuiTheme().appBar.color;
                        props.style.color = getMuiTheme().appBar.textColor;
                    }
                    return (
                        <MenuItem {...props} />
                    );
                })}
            </Drawer>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(GtMenu);
