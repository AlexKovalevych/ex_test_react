import React, {PropTypes} from 'react';

export default class Delta extends React.Component {
    static propTypes = {
        inverse: PropTypes.bool,
        value: PropTypes.string
    };

    render() {
        let numberValue = this.props.value.replace(/[^0-9-.]/g, '');

        if ((this.props.inverse && numberValue < 0) || (!this.props.inverse && numberValue > 0)) {
            return (<span><i className="arrow-up"></i> {this.props.value}</span>);
        }

        if ((this.props.inverse && numberValue > 0) || (!this.props.inverse && numberValue < 0)) {
            return (<span><i className="arrow-down"></i> {this.props.value}</span>);
        }

        return (<span>{this.props.value}</span>);
    }
}
