import React, {PropTypes} from 'react';

const styles = {
    up: {
        borderBottom: '9px solid #7ac943',
        width: 0,
        height: 0,
        display: 'inline-block',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent'
    },
    down: {
        borderTop: '9px solid #f15a24',
        width: 0,
        height: 0,
        display: 'inline-block',
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent'
    }
};

export default class Delta extends React.Component {
    static propTypes = {
        inverse: PropTypes.bool,
        value: PropTypes.string
    };

    render() {
        let numberValue = this.props.value.replace(/[^0-9-.]/g, '');

        if ((this.props.inverse && numberValue < 0) || (!this.props.inverse && numberValue > 0)) {
            return (<span><i style={styles.up}></i> {this.props.value}</span>);
        }

        if ((this.props.inverse && numberValue > 0) || (!this.props.inverse && numberValue < 0)) {
            return (<span><i style={styles.down}></i> {this.props.value}</span>);
        }

        return (<span>{this.props.value}</span>);
    }
}
