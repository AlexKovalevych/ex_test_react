import React, {PropTypes} from 'react';
import gtTheme from 'themes';

export default class Title extends React.Component {
    static propTypes = {
        title: PropTypes.element
    };

    render() {
        return (
            <h1 style={gtTheme.theme.title}>{this.props.title}</h1>
        );
    }
}
