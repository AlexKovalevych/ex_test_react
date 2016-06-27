import React, { PropTypes } from 'react';
import Collapse from 'rc-collapse';
import { Link } from 'react-router';

export default class GtMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '0'
        };
    }

    renderNode(block, node, i) {
        return (
            <li key={i} className="nav-item">
                <Link to={`/${block}/${node}`}>{node}</Link>
            </li>
        );
    }

    renderBlock(block, i) {
        let parentBlock = this.props.permissions[block];
        let permissions = Object.keys(parentBlock).filter((node) => {
            return parentBlock[node].length > 0;
        });

        return (
            <Collapse.Panel key={i} header={block}>
                <ul className="nav nav-pills nav-stacked">
                    {permissions.map(this.renderNode.bind(this, block))}
                </ul>
            </Collapse.Panel>
        );
    }

    onChange(activeKey) {
        this.setState({activeKey});
    }

    render() {
        let permissions = Object.keys(this.props.permissions).filter((block) => {
            let parentBlock = this.props.permissions[block];
            let children = Object.keys(parentBlock).filter((node) => {
                return parentBlock[node].length > 0;
            });
            return children.length > 0;
        });

        return (
            <Collapse accordion={true} onChange={this.onChange.bind(this)} activeKey={this.state.activeKey}>
                {permissions.map(this.renderBlock.bind(this))}
            </Collapse>
        );
    }
}

GtMenu.propTypes = {
    permissions: PropTypes.object
};
