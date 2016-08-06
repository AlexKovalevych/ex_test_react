import React, {PropTypes} from 'react';
import gtTheme from 'themes';

export default class Title extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string
    };

    render() {
        return (
            <h1 className={this.props.className} style={gtTheme.theme.title}>{this.props.children}</h1>
        );
    }
}
