import React, { PropTypes } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    minWidth: 44
};

export default class PageView extends React.Component {
    static propTypes = {
        page: PropTypes.number,
        selected: PropTypes.bool,
        onClick: PropTypes.func
    };

    render() {
        let props = {
            label: this.props.page,
            onClick: this.props.onClick,
            style: styles
        };
        if (this.props.selected) {
            props.primary = true;
        }

        return (
            <RaisedButton {...props} />
        );
    }
}
