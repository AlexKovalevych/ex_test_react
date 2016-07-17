import React, {PropTypes} from 'react';
import formatter from 'managers/Formatter';

export default class DashboardProgress extends React.Component {
    static propTypes = {
        sortBy: PropTypes.string,
        periods: PropTypes.object,
        totals: PropTypes.object,
        stats: PropTypes.object
    };

    render() {
        let currentValue = this.props.stats.current[this.props.sortBy];
        let comparisonValue = this.props.stats.comparison[this.props.sortBy];

        return (
            <div>
                <div className="row">
                    <div className="col-xs-6 text-left"><h5>Current</h5></div>
                    <div className="col-xs-6 text-right">
                        <h3>{formatter.formatValue(currentValue, this.props.sortBy)}</h3>
                    </div>
                </div>
            </div>
        );
    }
}

// <div class="currentPrevious row pad-lft pad-rgt">
//     <div class="row">
//         <div class="col-lg-6 col-md-6 col-xs-6 text-left">
//             <h5>Июл 2016</h5>
//         </div>
//         <div class="col-lg-6 col-md-6 col-xs-6 text-right">
//             <h3 class="custom-h3" id="total_currentPeriodTotal">$36,830,000</h3>
//         </div>
//         <div class="col-lg-12 col-md-12 col-xs-12">
//             <div class="progress" data-original-title="" title="">
//                 <div id="total_currentPeriodProgressZero" class="progress-bar" style="width: 0%; background: transparent;"></div>
//                                                                     <div class="progress-bar progress-bar-primary" style="padding-left: 1px; text-align: left; width: 91.9741%;" id="total_currentPeriodProgress"></div>
//             </div>
//         </div>
//         <div class="col-lg-12" id="total_delta" style="clear: both;"><span><i class="arrow-down"></i> $-3,213,900</span> | -8%</div>
//     </div>

//     <div class="row pad-btm">
//         <div class="col-lg-6 col-md-6 col-xs-6 text-left">
//             <h5>Июн 2016</h5>
//         </div>
//         <div class="col-lg-6 col-md-6 col-xs-6 text-right">
//             <h3 class="custom-h3" id="total_previousPeriodTotal">$40,043,900</h3>
//         </div>
//         <div class="col-lg-12 col-md-12 col-xs-12">
//             <div class="progress" data-original-title="" title="">
//                 <div id="total_previousPeriodProgressZero" class="progress-bar" style="width: 0%; background: transparent;"></div>
//                                                                     <div class="progress-bar progress-bar-gray" style="padding-left: 1px; text-align: left; width: 100%;" id="total_previousPeriodProgress"></div>
//             </div>
//         </div>
//     </div>
// </div>
