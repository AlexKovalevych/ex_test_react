import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export const IconLeft = (props) => {
    const { icon, text, url } = props;

    return (
        <Link style={{paddingRight: 10}} to={url}>
            <span style={{paddingRight: 10}} className={icon}></span>
            <span>{text}</span>
        </Link>
    );
};

export const IconRight = (props) => {
    const { icon, text, url } = props;

    return (
        <Link style={{paddingRight: 10}} to={url}>
            <span>{text}</span>
            <div style={{float: 'right', display: 'inline-block', paddingRight: 2}}>
                <span style={{ paddingRight: 10 }} className={icon}></span>
            </div>
        </Link>
    );
};

export const IconBoth = (props) => {
    const { iconLeft, iconRight, text } = props;

    return (
        <div>
            <span style={{paddingRight: 10}} className={iconLeft}></span>
            <span key={`${props.id}-txt`}>{text}</span>
            <div style={{float: 'right', display: 'inline-block', paddingRight: 2}}>
                <span style={{ paddingRight: 10 }} className={iconRight}></span>
            </div>
        </div>
    );
};

const propTypes = {
    text: PropTypes.string,
    id: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string
};

IconLeft.propTypes = propTypes;
IconRight.propTypes = propTypes;
IconBoth.propTypes = {
    text: PropTypes.string,
    id: PropTypes.string,
    iconLeft: PropTypes.string,
    iconRight: PropTypes.string
};
