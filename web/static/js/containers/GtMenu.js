import React, { PropTypes } from 'react';
import Collapse, { Panel } from 'rc-collapse';

export default class GtMenu extends React.Component {
    renderBlock(block) {
        if (block.projects && block.projects.length > 0) {
            return (
                <Panel header={block.block}></Panel>
            );
        }
    }

    render() {
        // const style = {
        //     display: 'inline-block',
        //     float: 'left',
        //     margin: '16px 32px 16px 0'
        // };

        return (
            <Collapse accordion={true}>
                {this.props.permissions.map(this.renderBlock.bind(this))}
            </Collapse>
        );
    }
}

GtMenu.propTypes = {
    permissions: PropTypes.array
};
