import React, { PropTypes } from 'react';
// import Collapse from 'react-collapse';
import { Link } from 'react-router';
import { connect } from 'react-redux';
// import { Dropdown } from 'react-bootstrap';
import { SideNav, Nav, NavGroup } from 'react-sidenav/dist/react-sidenav.min.js';

class GtMenu extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        location: PropTypes.object
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            activeKey: 0
        };
    }

    componentWillMount() {
        let blocks = Object.keys(this.props.user.permissions);
        let activeKey = 0;
        for (let i in blocks) {
            if (this.isActiveBlock(blocks[i])) {
                activeKey = i;
                break;
            }
        }
        this.setState({activeKey});
    }

    getUrl(block, node) {
        if (node == 'dashboard_index') {
            return '/';
        }
        return `/${block}/${node}`;
    }

    isActiveBlock(block) {
        return this.context.router.isActive(block) || (block == 'dashboard' && this.props.location.pathname == '/');
    }

    renderNode(block, node, i) {
        let url = this.getUrl(block, node);
        let linkProps = {
            to: url,
            className: 'dropdown-item'
        };

        if (this.props.location.pathname == url) {
            linkProps.className += ' active';
        }

        return (
            <Link key={i} {...linkProps}>{node}</Link>
        );
    }

    toggleBlock(i) {
        this.setState({activeKey: i});
    }

    renderBlock(block, i) {
        let parentBlock = this.props.user.permissions[block];
        let permissions = Object.keys(parentBlock).filter((node) => {
            return parentBlock[node].length > 0;
        });
        let props = {
            key: i,
            className: 'nav-item'
        };
        if (this.isActiveBlock(block)) {
            props.className = 'active';
        }

        let iconClass = 'fa-caret-down';
        if (this.state.activeKey == i) {
            iconClass = 'fa-caret-right';
        }

        // return (
        // );
    }
            // <Dropdown key={i} className="nav-item" componentClass="li" id="locale">
            //     <Dropdown.Toggle className="nav-link" useAnchor>
            //         {block}
            //     </Dropdown.Toggle>
            //     <Dropdown.Menu>
            //         {permissions.map(this.renderNode.bind(this, block))}
            //     </Dropdown.Menu>
            // </Dropdown>

    render() {
        let permissions = Object.keys(this.props.user.permissions).filter((block) => {
            let parentBlock = this.props.user.permissions[block];
            let children = Object.keys(parentBlock).filter((node) => {
                return parentBlock[node].length > 0;
            });
            return children.length > 0;
        });

var navi = [
    { id: 'dashboard', icon: 'fa fa-dashboard' , text: 'Dashboard'},
    { id: 'products', icon: 'fa fa-cube', text: 'Products' ,
        navlist: [
          { icon: 'fa fa-desktop', id: 'manage' ,text: 'Manage Product' },
          { icon: 'fa fa-cog', id: 'suppliers' ,text: 'Suppliers' }
        ]
    },
    { id: 'inventory', icon: 'fa fa-database' ,text: 'Inventory'},
    { id: 'deliveries', icon: 'fa fa-truck' ,text: 'Deliveries'},
    { id: 'reports', icon: 'fa fa-bar-chart' ,text: 'Reports' }
];

        return (
            <div className="menu">
                <SideNav navs={navi} style={{color: 'inherit'}} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(GtMenu);
