import React, { PropTypes } from 'react';
import Collapse from 'rc-collapse';
import { Link } from 'react-router';

export default class GtMenu extends React.Component {
    renderNode(node, block, i) {
        console.log(node, block, i);
        return (
            <li key={i} className="nav-item">
                <Link to="">{node.name}</Link>
            </li>
        );
    }

    renderBlock(block, i) {
        let permissions = block.children.filter((node) => {
            return node.projects && node.projects.length > 0;
        });

        return (
            <Collapse.Panel key={i} header={block.name}>
                <ul className="nav nav-pills nav-stacked">
                    {permissions.map(this.renderNode.bind(this, block))}
                </ul>
            </Collapse.Panel>
        );
    }

    render() {
        let permissions = this.props.permissions.filter((block) => {
            // return block.projects && block.projects.length > 0;
        });

        return (
            <Collapse accordion={true}>
                {permissions.map(this.renderBlock.bind(this))}
            </Collapse>
        );
    }
}

GtMenu.propTypes = {
    permissions: PropTypes.array
};
