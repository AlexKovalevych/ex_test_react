import React, { PropTypes } from 'react';
import { IconLeft, IconRight, IconBoth } from './Items';

export const ITEM_MAP = {
    'icon-left': IconLeft,
    'icon-right': IconRight,
    'icon-both': IconBoth
};

export const isActive = (props) => {
    return (props.selected && props.selected === props.id);
};

export default class Nav extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        selected: PropTypes.string,
        type: PropTypes.string,
        navrenderer: PropTypes.node
    };

    itemClicked() {
        if ( this.props.onClick ) {
            this.props.onClick(this.props.id);
        }
    }

    render() {
        const { type } = this.props;
        const Item = ( ITEM_MAP[type] ? ITEM_MAP[type] :
            this.props.navrenderer ) || IconLeft;

        let classes = 'sidenav-item';
        if (isActive(this.props)) {
            classes += ' bg-primary';
        }

        return (
            <div onClick={this.itemClicked.bind(this)} className={classes}>
                <Item {...this.props} />
            </div>
        );
    }
}
