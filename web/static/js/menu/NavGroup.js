import React, { PropTypes } from 'react';
import Nav from './Nav';
import { ITEM_MAP } from './Nav';

export default class NavGroup extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        selected: PropTypes.any,
        nav: PropTypes.object.isRequired,
        children: PropTypes.node,
        id: PropTypes.string,
        type: PropTypes.string,
        icon: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {collapsed: !this.isActive()};
    }

    buildChildren() {
        return this.props.nav.navlist.map(nav => {
            return (
                <Nav
                    type={this.props.type}
                    key={nav.id}
                    selected={this.props.selected}
                    onClick={this.onSubNavClick.bind(this)}
                    {...nav}/>
                );
        });
    }

    componentWillReceiveProps(nextProps) {
        let currentBlockItem;
        for (let i of Object.keys(nextProps.nav.navlist)) {
            if (nextProps.nav.navlist[i].id == nextProps.selected) {
                currentBlockItem = true;
                break;
            }
        }

        this.setState({
            selected: nextProps.selected,
            collapsed: !currentBlockItem
        });
    }

    onSubNavClick(id) {
        if (this.props.onClick) {
            this.props.onClick(this.props.id, id);
        }
    }

    onClick() {
        this.setState({collapsed: !this.state.collapsed});
    }

    componentDidMount() {
        //we cant transition 0 height to auto height.. so below is the result
        if ( !this.__computedHeight ) {
            let cloned = this.refs.cont.cloneNode(true);
            cloned.style.position = 'absolute';
            cloned.style.left = '-9999px';
            cloned.style.height = 'auto';
            document.body.appendChild(cloned);
            this.__computedHeight = cloned.clientHeight;
            document.body.removeChild(cloned);
        }
    }

    isActive() {
        return !!this.props.nav.navlist.find(nav => {
            return this.props.selected == nav.id;
        });
    }

    render() {
        const styles = {
            maxHeight: this.state.collapsed ? 0 : (this.__computedHeight ? this.__computedHeight * 2 : 500)
        };

        let itemType = this.props.type || 'icon-both';
        const Item = ITEM_MAP[itemType];
        let props = {};
        if (itemType == 'icon-both') {
            props.iconLeft = this.props.icon;
            props.iconRight = 'fa fa-chevron-down';
        } else {
            props.icon = 'fa fa-chevron-down';
        }

        return (
            <div className="nav-group" >
                <div onClick={this.onClick.bind(this)} className="nav-group-title">
                    <Item {...props} text={this.props.nav.text} />
                </div>
                <div  ref='cont' style={styles} className="nav-group-items">
                    {this.buildChildren()}
                </div>
            </div>
        );
    }
}
