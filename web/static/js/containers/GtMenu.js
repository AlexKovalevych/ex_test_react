import React, { PropTypes } from 'react';
import Collapse from 'react-collapse';
import { Link } from 'react-router';
import { connect } from 'react-redux';

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
            className: 'nav-link'
        };

        if (this.props.location.pathname == url) {
            linkProps.className += ' active';
        }

        return (
            <li key={i} className="nav-item">
                <Link {...linkProps}>{node}</Link>
            </li>
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

        return (
            <li {...props}>
                <div
                    className="nav-link block"
                    onClick={this.toggleBlock.bind(this, i)}
                >
                    <i className={`pull-left fa ${iconClass}`}></i>
                    {block}
                </div>
                <Collapse isOpened={this.state.activeKey == i}>
                    <ul className='nav nav-pills nav-stacked'>
                        {permissions.map(this.renderNode.bind(this, block))}
                    </ul>
                </Collapse>
            </li>
        );
    }

    render() {
        let permissions = Object.keys(this.props.user.permissions).filter((block) => {
            let parentBlock = this.props.user.permissions[block];
            let children = Object.keys(parentBlock).filter((node) => {
                return parentBlock[node].length > 0;
            });
            return children.length > 0;
        });

        return (
            <ul className="nav nav-pills nav-stacked">
                {permissions.map(this.renderBlock.bind(this))}
            </ul>
        );
    }
}

const mapStateToProps = (state) => {
    return state.auth;
};

export default connect(mapStateToProps)(GtMenu);
