import React, { PropTypes } from 'react';
// import classNames from 'classnames';

// import createFragment from 'react-addons-create-fragment';
import PageView from './PageView';
import BreakView from './BreakView';
import FontIcon from 'material-ui/FontIcon';

export default class Pagination extends React.Component {
    static propTypes = {
        totalPages: PropTypes.number.isRequired,
        pageRangeDisplayed: PropTypes.number,
        marginPagesDisplayed: PropTypes.number,
  //   previousLabel         : PropTypes.node,
  //   nextLabel             : PropTypes.node,
  //   breakLabel            : PropTypes.node,
        clickCallback: PropTypes.func,
        initialSelected: PropTypes.number
  //   forceSelected         : PropTypes.number,
  //   containerClassName    : PropTypes.string,
  //   pageClassName         : PropTypes.string,
  //   pageLinkClassName     : PropTypes.string,
  //   activeClassName       : PropTypes.string,
  //   previousClassName     : PropTypes.string,
  //   nextClassName         : PropTypes.string,
  //   previousLinkClassName : PropTypes.string,
  //   nextLinkClassName     : PropTypes.string,
  //   disabledClassName     : PropTypes.string,
  //   breakClassName        : PropTypes.string
    };

    static defaultProps = {
        pageRangeDisplayed: 2,
        marginPagesDisplayed: 3
  //   activeClassName      : "selected",
  //   previousClassName    : "previous",
  //   nextClassName        : "next",
  //   previousLabel        : "Previous",
  //   nextLabel            : "Next",
  //   breakLabel           : "...",
  //   disabledClassName    : "disabled"
    };

    constructor(props) {
        super(props);
        this.state = {
            selected: props.initialSelected ? props.initialSelected : 0
        };
    }

    // componentDidMount() {
    //     // Call the callback with the initialSelected item:
    //     if (typeof(this.props.initialSelected) !== 'undefined') {
    //         this.callCallback(this.props.initialSelected);
    //     }
    // }

    // componentWillReceiveProps(nextProps) {
    //     if (typeof(nextProps.forceSelected) !== 'undefined' && this.props.forceSelected !== nextProps.forceSelected) {
    //       this.setState({selected: nextProps.forceSelected});
    //     }
    // }

    handlePreviousPage(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected > 0) {
            this.handlePageSelected(this.state.selected - 1, e);
        }
    }

    handleNextPage(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected < this.props.totalPages - 1) {
            this.handlePageSelected(this.state.selected + 1, e);
        }
    }

    handlePageSelected(selected, e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        if (this.state.selected === selected) return;
        this.setState({selected: selected});

        // Call the callback with the new selected item:
        this.callCallback(selected);
    }

    callCallback(selectedItem) {
        this.props.clickCallback({selected: selectedItem});
    }

    getPagination() {
        let items = {};
        if (this.props.totalPages <= this.props.pageRangeDisplayed) {
            for (let index = 0; index < this.props.totalPages; index++) {
                items['key' + index] = (
                    <PageView
                        onClick={this.handlePageSelected.bind(null, index)}
                        selected={this.state.selected === index}
                        page={index + 1} />
                );
            }
        } else {
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
                let pageView = (
                    <PageView
                        onClick={this.handlePageSelected.bind(null, index)}
                        selected={this.state.selected === index}
                        page={index + 1} />
                );

                if (page <= this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }

                if (page > this.props.totalPages - this.props.marginPagesDisplayed) {
                    items['key' + index] = pageView;
                    continue;
                }

                if ((index >= this.state.selected - leftSide) && (index <= this.state.selected + rightSide)) {
                    items['key' + index] = pageView;
                    continue;
                }

                let keys = Object.keys(items);
                let breakLabelKey = keys[keys.length - 1];
                let breakLabelValue = items[breakLabelKey];

                if (breakLabelValue !== breakView) {
                    breakView = (<BreakView />);
                    items['key' + index] = breakView;
                }
            }
        }

        return items;
    }

    render() {
        // let disabled = this.props.disabledClassName;
        // const previousClasses = classNames(this.props.previousClassName,
        //                                    {[disabled]: this.state.selected === 0});

        // const nextClasses = classNames(this.props.nextClassName,
        //                                {[disabled]: this.state.selected === this.props.totalPages - 1});

        return (
            <ul style={{display: 'inline-block'}}>
                <FontIcon className="material-icons" onClick={this.handlePreviousPage.bind(this)}>navigation_left</FontIcon>
                {this.getPagination()}
                <FontIcon className="material-icons" onClick={this.handleNextPage.bind(this)}>navigation_right</FontIcon>
            </ul>
        );
    }
}
