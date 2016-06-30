import React, { Children, cloneElement, PropTypes } from 'react';
import NavGroup from './NavGroup';
import Nav from './Nav';
import assign from 'object-assign';

export default class SideNav extends React.Component {
    static propTypes = {
        selected: PropTypes.string,
        navs: PropTypes.array,
        onSelection: PropTypes.func,
        children: PropTypes.node,
        navtype: PropTypes.string,
        navrenderer: PropTypes.node,
        style: PropTypes.object,
        className: PropTypes.string
    };

    buildFromSettings() {
        return this.props.navs.map((navkind, i) => {
            //nav kind could have a navlist, which we assume it contains a group of navs link
            if (navkind.navlist && navkind.navlist.length > 0) {
                return (
                    <NavGroup
                        key={i}
                        type={this.props.navtype}
                        id={navkind.id}
                        selected={this.props.selected}
                        onClick={this.onSubNavClick.bind(this)}
                        nav={navkind}
                        icon={navkind.icon}
                    />
                );
            } else {
                return (
                    <Nav
                        type={this.props.navtype}
                        key={navkind.id}
                        selected={this.props.selected}
                        {...navkind}
                        onClick={this.onClick.bind(this)}
                    />
                );
            }
        });
    }

    onSubNavClick(group, child) {
        let selection = {group: group, id: child};
        this.setState({selected: selection});
        this.dispatchSelection(selection);
    }

    onClick(id) {
        this.dispatchSelection({id: id});
    }

    dispatchSelection(selection) {
        if ( this.props.onSelection ) {
            this.props.onSelection(selection);
        }
    }

    buildChildren() {
        if ( this.props.navs ) {
            return this.buildFromSettings();
        } else {
            //we need to clone this or props aren't passed
            return Children.map(this.props.children, child => {
                return cloneElement(child, assign({key: child.props.id}, this.props));
            });
        }
    }

    render() {
        return (
            <div style={assign({position: 'relative', width: '100%'}, this.props.style)} className={this.props.className}>
                {this.buildChildren()}
            </div>
        );
    }
}
