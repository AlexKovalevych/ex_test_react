import React, { PropTypes } from 'react';
import PageView from './PageView';
import BreakView from './BreakView';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';

export default class Pagination extends React.Component {
    static propTypes = {
        totalPages: PropTypes.number.isRequired,
        pageRangeDisplayed: PropTypes.number,
        marginPagesDisplayed: PropTypes.number,
        clickCallback: PropTypes.func,
        initialSelected: PropTypes.number
    };

    static defaultProps = {
        pageRangeDisplayed: 2,
        marginPagesDisplayed: 3
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: props.initialSelected ? props.initialSelected : 0
        };
    }

    componentWillReceiveProps(newProps) {
        if (newProps.initialSelected != this.props.initialSelected) {
            this.setState({selected: newProps.initialSelected});
        }
    }

    onPreviousPage(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected > 0) {
            this.onSelectPage(this.state.selected - 1, e);
        }
    }

    onNextPage(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected < this.props.totalPages - 1) {
            this.onSelectPage(this.state.selected + 1, e);
        }
    }

    onSelectPage(selected, e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected === selected) return;
        this.setState({selected: selected});

        // Call the callback with the new selected item:
        this.callCallback(selected + 1);
    }

    callCallback(selectedItem) {
        this.props.clickCallback(selectedItem);
    }

    createPageView(index) {
        return (
            <PageView
                key={'key' + index}
                onClick={this.onSelectPage.bind(this, index)}
                selected={this.state.selected === index}
                page={index + 1} />
        );
    }

    getPagination() {
        let items = [];
        if (this.props.totalPages <= this.props.pageRangeDisplayed) {
            for (let index = 0; index < this.props.totalPages; index++) {
                items.push(this.createPageView(index));
            }
        } else {
            let keys = [];
            let leftSide  = (this.props.pageRangeDisplayed / 2);
            let rightSide = (this.props.pageRangeDisplayed - leftSide);

            if (this.state.selected > this.props.totalPages - this.props.pageRangeDisplayed / 2) {
                rightSide = this.props.totalPages - this.state.selected;
                leftSide  = this.props.pageRangeDisplayed - rightSide;
            } else if (this.state.selected < this.props.pageRangeDisplayed / 2) {
                leftSide  = this.state.selected;
                rightSide = this.props.pageRangeDisplayed - leftSide;
            }

            let index, page, breakView;
            for (index = 0; index < this.props.totalPages; index++) {
                page = index + 1;
                if (page <= this.props.marginPagesDisplayed) {
                    keys.push(index);
                    items.push(this.createPageView(index));
                    continue;
                }

                if (page > this.props.totalPages - this.props.marginPagesDisplayed) {
                    items.push(this.createPageView(index));
                    continue;
                }

                if ((index >= this.state.selected - leftSide) && (index <= this.state.selected + rightSide)) {
                    items.push(this.createPageView(index));
                    continue;
                }

                let breakLabelValue = items[keys.length - 1];
                if (breakLabelValue !== breakView) {
                    breakView = (<BreakView />);
                    items.push(<BreakView key={'key' + index} />);
                    keys.push(index);
                }
            }
        }

        return items;
    }

    render() {
        return (
            <ul style={{display: 'inline-block'}}>
                <FlatButton
                    hoverColor="none"
                    icon={
                        <FontIcon className="material-icons" onClick={this.onPreviousPage.bind(this)}>
                            navigate_before
                        </FontIcon>
                    }
                />
                {this.getPagination()}
                <FlatButton
                    hoverColor="none"
                    icon={
                        <FontIcon className="material-icons" onClick={this.onNextPage.bind(this)}>
                            navigate_next
                        </FontIcon>
                    }
                />
            </ul>
        );
    }
}
