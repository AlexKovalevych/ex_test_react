import React, {PropTypes} from 'react';
import gtTheme from 'themes';

export default class Title extends React.Component {
    static propTypes = {
        title: PropTypes.element,
        className: PropTypes.string
    };

    render() {
        return (
            <h1 className={this.props.className} style={gtTheme.theme.title}>{this.props.title}</h1>
        );
    }
}
