import React, { PropTypes } from 'react';

export default class Main extends React.Component {
    static propTypes = {
        children: PropTypes.object
    };

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}
